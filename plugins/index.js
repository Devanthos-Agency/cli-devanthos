/**
 * Índice de Plugins de Devanthos v2.0
 *
 * Sistema de carga de plugins con soporte para:
 * - Nueva estructura modular (plugin.json + src/)
 * - Retrocompatibilidad con archivos .plugin.js legacy
 * - Instalación automática de archivos y dependencias
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Caché de plugins cargados
 */
let pluginsCache = null;

/**
 * Detecta y carga plugins desde la nueva estructura (carpetas con plugin.json)
 * @returns {Object} Mapa de plugins en nueva estructura
 */
function loadModularPlugins() {
    const plugins = {};
    const pluginsDir = __dirname;

    try {
        const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const pluginDir = path.join(pluginsDir, entry.name);
            const pluginJsonPath = path.join(pluginDir, "plugin.json");

            // Verificar si existe plugin.json
            if (fs.existsSync(pluginJsonPath)) {
                try {
                    const pluginJsonContent = fs.readFileSync(pluginJsonPath, "utf8");
                    const pluginMetadata = JSON.parse(pluginJsonContent);

                    // Enriquecer con información adicional
                    pluginMetadata._type = "modular";
                    pluginMetadata._path = pluginDir;
                    pluginMetadata._srcPath = path.join(pluginDir, "src");

                    plugins[pluginMetadata.name] = pluginMetadata;
                } catch (error) {
                    console.warn(`⚠️ Error cargando plugin en ${entry.name}:`, error.message);
                }
            }
        }
    } catch (error) {
        console.warn("⚠️ Error escaneando plugins modulares:", error.message);
    }

    return plugins;
}

/**
 * Carga plugins legacy (.plugin.js) para retrocompatibilidad
 * @returns {Object} Mapa de plugins legacy
 */
async function loadLegacyPlugins() {
    const plugins = {};

    const legacyFiles = [
        "analytics.plugin.js",
        "seo.plugin.js",
        "auth.plugin.js",
        "database.plugin.js",
        "content.plugin.js",
        "stripe.plugin.js",
        "expo-auth.plugin.js"
    ];

    for (const file of legacyFiles) {
        const filePath = path.join(__dirname, file);

        if (fs.existsSync(filePath)) {
            try {
                const module = await import(`./${file}`);
                const plugin = module.default;

                if (plugin && plugin.name) {
                    plugin._type = "legacy";
                    plugin._path = filePath;
                    plugins[plugin.name] = plugin;
                }
            } catch (error) {
                console.warn(`⚠️ Error cargando plugin legacy ${file}:`, error.message);
            }
        }
    }

    return plugins;
}

/**
 * Carga todos los plugins (modulares + legacy)
 * @param {boolean} forceReload - Forzar recarga ignorando caché
 * @returns {Promise<Object>} Mapa de todos los plugins disponibles
 */
export async function loadAllPlugins(forceReload = false) {
    if (pluginsCache && !forceReload) {
        return pluginsCache;
    }

    const modularPlugins = loadModularPlugins();
    const legacyPlugins = await loadLegacyPlugins();

    // Los plugins modulares tienen prioridad sobre los legacy
    pluginsCache = { ...legacyPlugins, ...modularPlugins };

    return pluginsCache;
}

/**
 * Mapa de plugins disponibles (para retrocompatibilidad)
 * Se carga de forma lazy
 */
export const AVAILABLE_PLUGINS = await loadAllPlugins();

/**
 * Obtiene un plugin por su nombre
 * @param {string} pluginName - Nombre del plugin (@devanthos/plugin-xxx)
 * @returns {Promise<Object|null>} Plugin o null si no existe
 */
export async function getPlugin(pluginName) {
    const plugins = await loadAllPlugins();
    return plugins[pluginName] || null;
}

/**
 * Lista todos los plugins disponibles
 * @param {Object} options - Opciones de filtrado
 * @param {string} options.type - Filtrar por tipo ('modular', 'legacy')
 * @param {string} options.framework - Filtrar por framework
 * @returns {Promise<Array>} Lista de plugins con metadata
 */
export async function listPlugins(options = {}) {
    const plugins = await loadAllPlugins();
    let pluginList = Object.values(plugins);

    // Filtrar por tipo
    if (options.type) {
        pluginList = pluginList.filter(p => p._type === options.type);
    }

    // Filtrar por framework
    if (options.framework) {
        pluginList = pluginList.filter(p => {
            if (p._type === "modular") {
                return p.frameworks && p.frameworks.includes(options.framework);
            } else {
                return p.dependencies && p.dependencies[options.framework];
            }
        });
    }

    return pluginList.map(plugin => ({
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        type: plugin._type,
        frameworks: plugin.frameworks || Object.keys(plugin.dependencies || {})
    }));
}

/**
 * Verifica si un plugin existe
 * @param {string} pluginName - Nombre del plugin
 * @returns {Promise<boolean>} True si existe
 */
export async function hasPlugin(pluginName) {
    const plugins = await loadAllPlugins();
    return pluginName in plugins;
}

/**
 * Obtiene plugins por framework
 * @param {string} framework - Framework (astro, next, expo)
 * @returns {Promise<Array>} Lista de plugins compatibles
 */
export async function getPluginsByFramework(framework) {
    const plugins = await loadAllPlugins();

    return Object.values(plugins).filter(plugin => {
        if (plugin._type === "modular") {
            return plugin.frameworks && plugin.frameworks.includes(framework);
        } else {
            // Legacy
            return (
                plugin.dependencies &&
                (plugin.dependencies[framework] || plugin.dependencies.expo === framework)
            );
        }
    });
}

/**
 * Obtiene los archivos que un plugin debe copiar al proyecto
 * @param {string} pluginName - Nombre del plugin
 * @param {string} framework - Framework del proyecto
 * @returns {Promise<Array>} Lista de archivos a copiar con rutas src y dest
 */
export async function getPluginFiles(pluginName, framework) {
    const plugin = await getPlugin(pluginName);

    if (!plugin) {
        throw new Error(`Plugin ${pluginName} no encontrado`);
    }

    if (plugin._type === "modular") {
        // Nueva estructura: leer desde plugin.json
        const files = plugin.files || [];
        return files
            .filter(file => !file.framework || file.framework === framework)
            .map(file => ({
                source: path.join(plugin._srcPath, file.source),
                destination: file.destination,
                framework: file.framework || "all"
            }));
    } else {
        // Legacy: usar la estructura antigua
        const filesConfig = plugin.files?.[framework] || [];
        return filesConfig.map(file => ({
            source: null, // No hay archivo fuente real en legacy
            destination: file.path,
            content: file.content, // El contenido está embedido
            framework
        }));
    }
}

/**
 * Obtiene las dependencias que un plugin requiere
 * @param {string} pluginName - Nombre del plugin
 * @param {string} framework - Framework del proyecto
 * @returns {Promise<Object>} Objeto con dependencies y devDependencies
 */
export async function getPluginDependencies(pluginName, framework) {
    const plugin = await getPlugin(pluginName);

    if (!plugin) {
        throw new Error(`Plugin ${pluginName} no encontrado`);
    }

    const result = {
        dependencies: {},
        devDependencies: {}
    };

    if (plugin._type === "modular") {
        // Nueva estructura: dependencies por framework
        const deps = plugin.dependencies?.[framework] || {};
        const devDeps = plugin.devDependencies?.[framework] || {};

        result.dependencies = deps;
        result.devDependencies = devDeps;
    } else {
        // Legacy: dependencies por framework
        result.dependencies = plugin.dependencies?.[framework] || {};
        result.devDependencies = plugin.devDependencies?.[framework] || {};
    }

    return result;
}

/**
 * Obtiene las variables de entorno que un plugin requiere
 * @param {string} pluginName - Nombre del plugin
 * @returns {Promise<Array>} Lista de variables de entorno requeridas
 */
export async function getPluginEnvVars(pluginName) {
    const plugin = await getPlugin(pluginName);

    if (!plugin) {
        throw new Error(`Plugin ${pluginName} no encontrado`);
    }

    return plugin.envVars || [];
}

/**
 * Obtiene las instrucciones post-instalación de un plugin
 * @param {string} pluginName - Nombre del plugin
 * @returns {Promise<Object>} Objeto con mensaje e instrucciones
 */
export async function getPluginPostInstall(pluginName) {
    const plugin = await getPlugin(pluginName);

    if (!plugin) {
        throw new Error(`Plugin ${pluginName} no encontrado`);
    }

    return plugin.postInstall || { message: "", instructions: [] };
}

/**
 * Obtiene estadísticas sobre los plugins cargados
 * @returns {Promise<Object>} Estadísticas de plugins
 */
export async function getPluginStats() {
    const plugins = await loadAllPlugins();
    const pluginList = Object.values(plugins);

    return {
        total: pluginList.length,
        modular: pluginList.filter(p => p._type === "modular").length,
        legacy: pluginList.filter(p => p._type === "legacy").length,
        byFramework: {
            astro: pluginList.filter(p => {
                return p.frameworks?.includes("astro") || p.dependencies?.astro;
            }).length,
            next: pluginList.filter(p => {
                return p.frameworks?.includes("next") || p.dependencies?.next;
            }).length,
            expo: pluginList.filter(p => {
                return p.frameworks?.includes("expo") || p.dependencies?.expo;
            }).length
        }
    };
}
