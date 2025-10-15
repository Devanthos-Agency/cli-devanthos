import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

/**
 * Sistema de plugins para Devanthos CLI
 * Los plugins pueden extender la funcionalidad del CLI en diferentes puntos del ciclo de vida
 */

class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.hooks = {
            beforeClone: [],
            afterClone: [],
            beforeInstall: [],
            afterInstall: [],
            onError: [],
            onComplete: []
        };
    }

    /**
     * Cargar un plugin desde un archivo .js (legacy) o estructura modular (plugin.json)
     * @param {string} pluginPath - Ruta al archivo/carpeta del plugin
     */
    async loadPlugin(pluginPath) {
        try {
            // Si es un directorio, buscar plugin.json
            if (existsSync(pluginPath) && readdirSync(pluginPath).includes("plugin.json")) {
                return await this.loadModularPlugin(pluginPath);
            }

            // Cargar plugin legacy (.plugin.js)
            const plugin = await import(pluginPath);
            const pluginModule = plugin.default || plugin;

            if (!pluginModule.name) {
                throw new Error(`Plugin en ${pluginPath} debe tener un nombre`);
            }

            if (!pluginModule.version) {
                pluginModule.version = "1.0.0";
            }

            // Validar plugin
            this.validatePlugin(pluginModule);

            // Registrar plugin
            this.plugins.set(pluginModule.name, pluginModule);

            // Registrar hooks del plugin
            this.registerPluginHooks(pluginModule);

            if (process.env.DEVANTHOS_VERBOSE === "true") {
                console.log(
                    chalk.gray(
                        `   🔌 Plugin cargado: ${pluginModule.name} v${pluginModule.version}`
                    )
                );
            }

            return pluginModule;
        } catch (error) {
            if (process.env.DEVANTHOS_VERBOSE === "true") {
                console.warn(
                    chalk.yellow(`⚠️ Error cargando plugin ${pluginPath}: ${error.message}`)
                );
            }
            return null;
        }
    }

    /**
     * Cargar plugin desde estructura modular (carpeta con plugin.json)
     * @param {string} pluginDir - Ruta al directorio del plugin
     */
    async loadModularPlugin(pluginDir) {
        try {
            const jsonPath = path.join(pluginDir, "plugin.json");
            const jsonContent = readFileSync(jsonPath, "utf-8");
            const pluginMeta = JSON.parse(jsonContent);

            // Normalizar files a array
            let files = [];
            if (pluginMeta.files) {
                if (Array.isArray(pluginMeta.files)) {
                    files = pluginMeta.files;
                } else if (typeof pluginMeta.files === "object") {
                    // Convertir formato { framework: [...] } a array
                    for (const [framework, fileList] of Object.entries(pluginMeta.files)) {
                        fileList.forEach(fileConfig => {
                            files.push({
                                ...fileConfig,
                                framework: framework
                            });
                        });
                    }
                }
            }

            // Crear módulo del plugin con metadata
            const pluginModule = {
                name: pluginMeta.name,
                version: pluginMeta.version || "1.0.0",
                description: pluginMeta.description || "",
                author: pluginMeta.author || "Unknown",
                frameworks: pluginMeta.frameworks || [],
                dependencies: pluginMeta.dependencies || {},
                devDependencies: pluginMeta.devDependencies || {},
                envVars: pluginMeta.envVars || [],
                files: files,
                postInstall: pluginMeta.postInstall || null,
                features: pluginMeta.features || [],
                _pluginDir: pluginDir,
                _isModular: true
            };

            // Registrar plugin
            this.plugins.set(pluginModule.name, pluginModule);

            if (process.env.DEVANTHOS_VERBOSE === "true") {
                console.log(
                    chalk.gray(
                        `   🔌 Plugin modular cargado: ${pluginModule.name} v${pluginModule.version}`
                    )
                );
            }

            return pluginModule;
        } catch (error) {
            if (process.env.DEVANTHOS_VERBOSE === "true") {
                console.warn(
                    chalk.yellow(`⚠️ Error cargando plugin modular ${pluginDir}: ${error.message}`)
                );
            }
            return null;
        }
    }

    /**
     * Validar estructura del plugin
     */
    validatePlugin(plugin) {
        const requiredFields = ["name"];
        const validHooks = Object.keys(this.hooks);

        for (const field of requiredFields) {
            if (!plugin[field]) {
                throw new Error(`Plugin debe tener campo requerido: ${field}`);
            }
        }

        // Validar que los hooks sean funciones
        for (const hook of validHooks) {
            if (plugin[hook] && typeof plugin[hook] !== "function") {
                throw new Error(`Hook ${hook} debe ser una función`);
            }
        }

        return true;
    }

    /**
     * Registrar hooks del plugin
     */
    registerPluginHooks(plugin) {
        for (const hookName of Object.keys(this.hooks)) {
            if (plugin[hookName] && typeof plugin[hookName] === "function") {
                this.hooks[hookName].push({
                    pluginName: plugin.name,
                    handler: plugin[hookName],
                    priority: plugin.priority || 100
                });
            }
        }

        // Ordenar por prioridad (menor = primero)
        for (const hookName of Object.keys(this.hooks)) {
            this.hooks[hookName].sort((a, b) => a.priority - b.priority);
        }
    }

    /**
     * Ejecutar hooks en un punto específico del ciclo de vida
     */
    async executeHook(hookName, context = {}) {
        const hooks = this.hooks[hookName] || [];

        if (hooks.length === 0) {
            return context;
        }

        let currentContext = { ...context };

        for (const hook of hooks) {
            try {
                const result = await hook.handler(currentContext);
                // Permitir que los plugins modifiquen el contexto
                if (result && typeof result === "object") {
                    currentContext = { ...currentContext, ...result };
                }
            } catch (error) {
                console.warn(
                    chalk.yellow(
                        `⚠️ Error en hook ${hookName} del plugin ${hook.pluginName}: ${error.message}`
                    )
                );
            }
        }

        return currentContext;
    }

    /**
     * Descubrir y cargar plugins automáticamente (legacy .js y modular plugin.json)
     */
    async discoverPlugins(searchPaths = []) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const cliPluginsDir = path.join(__dirname, "..", "plugins");

        const defaultPaths = [
            cliPluginsDir, // Plugins integrados en el CLI
            path.join(process.cwd(), "devanthos.plugins.js"),
            path.join(process.cwd(), ".devanthos", "plugins"),
            path.join(process.env.HOME || process.env.USERPROFILE || "", ".devanthos", "plugins")
        ];

        const allPaths = [...defaultPaths, ...searchPaths];

        for (const searchPath of allPaths) {
            if (!existsSync(searchPath)) {
                continue;
            }

            // Si es un archivo .js
            if (searchPath.endsWith(".js")) {
                await this.loadPlugin(searchPath);
                continue;
            }

            // Si es un directorio, buscar plugins
            try {
                const entries = readdirSync(searchPath, { withFileTypes: true });

                for (const entry of entries) {
                    const fullPath = path.join(searchPath, entry.name);

                    if (entry.isDirectory()) {
                        // Buscar plugin.json en subdirectorios (estructura modular)
                        const pluginJsonPath = path.join(fullPath, "plugin.json");
                        if (existsSync(pluginJsonPath)) {
                            await this.loadModularPlugin(fullPath);
                        }
                    } else if (entry.isFile()) {
                        // Cargar archivos .plugin.js (legacy)
                        if (entry.name.endsWith(".plugin.js")) {
                            await this.loadPlugin(fullPath);
                        }
                    }
                }
            } catch (error) {
                if (process.env.DEVANTHOS_VERBOSE === "true") {
                    console.warn(
                        chalk.yellow(`⚠️ Error leyendo directorio ${searchPath}: ${error.message}`)
                    );
                }
            }
        }

        return this.plugins.size;
    }

    /**
     * Listar plugins cargados
     */
    listPlugins() {
        const pluginList = Array.from(this.plugins.values()).map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            description: plugin.description || "Sin descripción",
            author: plugin.author || "Desconocido"
        }));

        return pluginList;
    }

    /**
     * Obtener plugin por nombre
     */
    getPlugin(name) {
        return this.plugins.get(name);
    }

    /**
     * Desactivar plugin
     */
    disablePlugin(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            return false;
        }

        // Remover hooks del plugin
        for (const hookName of Object.keys(this.hooks)) {
            this.hooks[hookName] = this.hooks[hookName].filter(hook => hook.pluginName !== name);
        }

        this.plugins.delete(name);
        return true;
    }

    /**
     * Instalar un plugin modular en un proyecto de usuario
     * @param {string} pluginName - Nombre del plugin a instalar
     * @param {string} projectPath - Ruta del proyecto donde instalar
     * @param {string} framework - Framework del proyecto (astro, next, expo)
     * @param {object} options - Opciones de instalación
     */
    async installPlugin(pluginName, projectPath, framework, options = {}) {
        const plugin = this.plugins.get(pluginName);

        if (!plugin) {
            throw new Error(`Plugin "${pluginName}" no encontrado`);
        }

        if (!plugin._isModular) {
            throw new Error(
                `Plugin "${pluginName}" no es modular, no se puede instalar automáticamente`
            );
        }

        // Validar framework
        if (!plugin.frameworks.includes(framework)) {
            throw new Error(
                `Plugin "${pluginName}" no es compatible con ${framework}. ` +
                    `Frameworks soportados: ${plugin.frameworks.join(", ")}`
            );
        }

        const { verbose = false, skipDependencies = false } = options;
        const results = {
            filesCopied: [],
            dependenciesInstalled: [],
            envVarsNeeded: [],
            errors: []
        };

        try {
            // 1. Copiar archivos
            if (verbose) {
                console.log(chalk.cyan(`\n📁 Copiando archivos del plugin ${pluginName}...`));
            }

            for (const fileConfig of plugin.files) {
                // Filtrar por framework si está especificado
                if (fileConfig.framework && fileConfig.framework !== framework) {
                    continue;
                }

                const sourcePath = path.join(plugin._pluginDir, fileConfig.source);
                const destPath = path.join(projectPath, fileConfig.destination);

                if (!existsSync(sourcePath)) {
                    results.errors.push(`Archivo fuente no encontrado: ${fileConfig.source}`);
                    continue;
                }

                // Crear directorios necesarios
                const destDir = path.dirname(destPath);
                if (!existsSync(destDir)) {
                    mkdirSync(destDir, { recursive: true });
                }

                // Copiar archivo
                copyFileSync(sourcePath, destPath);
                results.filesCopied.push(fileConfig.destination);

                if (verbose) {
                    console.log(chalk.gray(`   ✓ ${fileConfig.destination}`));
                }
            }

            // 2. Instalar dependencias
            if (!skipDependencies && plugin.dependencies) {
                const deps = plugin.dependencies[framework] || plugin.dependencies;

                if (deps && Object.keys(deps).length > 0) {
                    if (verbose) {
                        console.log(chalk.cyan(`\n📦 Instalando dependencias...`));
                    }

                    const depsArray = Array.isArray(deps)
                        ? deps
                        : Object.entries(deps).map(([pkg, version]) => `${pkg}@${version}`);

                    try {
                        const depsString = depsArray.join(" ");
                        execSync(`npm install ${depsString}`, {
                            cwd: projectPath,
                            stdio: verbose ? "inherit" : "ignore"
                        });
                        results.dependenciesInstalled = depsArray;
                    } catch (error) {
                        results.errors.push(`Error instalando dependencias: ${error.message}`);
                    }
                }
            }

            // 3. Informar sobre variables de entorno
            if (plugin.envVars && plugin.envVars.length > 0) {
                results.envVarsNeeded = Array.isArray(plugin.envVars)
                    ? plugin.envVars
                    : plugin.envVars[framework] || [];
            }

            // 4. Mostrar instrucciones post-instalación
            if (plugin.postInstall && verbose) {
                console.log(
                    chalk.green(`\n${plugin.postInstall.message || "✅ Plugin instalado"}`)
                );

                if (plugin.postInstall.instructions) {
                    console.log(chalk.cyan("\n📋 Instrucciones:"));
                    plugin.postInstall.instructions.forEach(instruction => {
                        console.log(chalk.gray(`   ${instruction}`));
                    });
                }
            }

            return results;
        } catch (error) {
            results.errors.push(error.message);
            throw error;
        }
    }

    /**
     * Listar plugins disponibles (solo modulares)
     */
    listAvailablePlugins(framework = null) {
        const plugins = Array.from(this.plugins.values())
            .filter(p => p._isModular)
            .filter(p => !framework || p.frameworks.includes(framework))
            .map(p => ({
                name: p.name,
                version: p.version,
                description: p.description,
                frameworks: p.frameworks,
                features: p.features || []
            }));

        return plugins;
    }
}

// Instancia singleton
const pluginManager = new PluginManager();

export { pluginManager, PluginManager };
