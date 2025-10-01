import { existsSync, readdirSync } from "fs";
import path from "path";
import chalk from "chalk";

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
     * Cargar un plugin desde un archivo o módulo
     * @param {string} pluginPath - Ruta al archivo del plugin
     */
    async loadPlugin(pluginPath) {
        try {
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
     * Descubrir y cargar plugins automáticamente
     */
    async discoverPlugins(searchPaths = []) {
        const defaultPaths = [
            path.join(process.cwd(), "devanthos.plugins.js"),
            path.join(process.cwd(), ".devanthos", "plugins"),
            path.join(process.env.HOME || process.env.USERPROFILE || "", ".devanthos", "plugins")
        ];

        const allPaths = [...defaultPaths, ...searchPaths];

        for (const searchPath of allPaths) {
            if (!existsSync(searchPath)) {
                continue;
            }

            // Si es un archivo
            if (searchPath.endsWith(".js")) {
                await this.loadPlugin(searchPath);
                continue;
            }

            // Si es un directorio, buscar archivos .js
            try {
                const files = readdirSync(searchPath);
                for (const file of files) {
                    if (file.endsWith(".plugin.js") || file.endsWith(".js")) {
                        const pluginPath = path.join(searchPath, file);
                        await this.loadPlugin(pluginPath);
                    }
                }
            } catch (error) {
                // Ignorar errores de lectura de directorios
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
}

// Instancia singleton
const pluginManager = new PluginManager();

export { pluginManager, PluginManager };
