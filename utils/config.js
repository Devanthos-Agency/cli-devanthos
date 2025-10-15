import { existsSync, writeFileSync } from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Configuración por defecto para proyectos Devanthos
 */
export const DEFAULT_CONFIG = {
    framework: null,
    preset: null,
    packageManager: "auto", // auto, npm, pnpm, yarn, bun
    git: {
        enabled: true,
        branch: "main",
        initialCommit: true
    },
    install: {
        enabled: true,
        skipDev: false
    },
    features: {
        typescript: true,
        tailwind: true,
        eslint: true,
        prettier: true
    },
    plugins: [],
    updateDeps: true,
    audit: false
};

/**
 * Presets predefinidos para diferentes tipos de proyectos
 */
export const PRESETS = {
    "landing-page": {
        name: "Landing Page",
        description: "Página de aterrizaje optimizada para conversión",
        framework: "astro",
        features: {
            typescript: true,
            tailwind: true,
            eslint: true,
            prettier: true,
            analytics: true,
            contactForm: true,
            seo: true
        },
        plugins: ["@devanthos/plugin-analytics", "@devanthos/plugin-seo"],
        dependencies: {
            astro: ["@astrojs/sitemap", "@astrojs/rss"]
        }
    },
    dashboard: {
        name: "Dashboard/Admin",
        description: "Panel administrativo con autenticación y tablas",
        framework: "next",
        features: {
            typescript: true,
            tailwind: true,
            eslint: true,
            prettier: true,
            auth: true,
            database: true,
            charts: true
        },
        plugins: ["@devanthos/plugin-auth", "@devanthos/plugin-database"],
        dependencies: {
            next: ["recharts", "@tanstack/react-table", "next-auth", "prisma"]
        }
    },
    blog: {
        name: "Blog/Content Site",
        description: "Blog con MDX, RSS y sistema de contenido",
        framework: "astro",
        features: {
            typescript: true,
            tailwind: true,
            eslint: true,
            prettier: true,
            mdx: true,
            rss: true,
            sitemap: true,
            seo: true
        },
        plugins: ["@devanthos/plugin-content", "@devanthos/plugin-seo"],
        dependencies: {
            astro: ["@astrojs/mdx", "@astrojs/rss", "@astrojs/sitemap"]
        }
    },
    ecommerce: {
        name: "E-commerce",
        description: "Tienda online con carrito y pagos",
        framework: "next",
        features: {
            typescript: true,
            tailwind: true,
            eslint: true,
            prettier: true,
            cart: true,
            payments: true,
            database: true,
            auth: true
        },
        plugins: [
            "@devanthos/plugin-stripe",
            "@devanthos/plugin-mercadopago",
            "@devanthos/plugin-database",
            "@devanthos/plugin-auth"
        ],
        dependencies: {
            next: ["stripe", "@stripe/stripe-js", "zustand", "prisma"]
        }
    },
    portfolio: {
        name: "Portfolio",
        description: "Portafolio personal con proyectos y blog",
        framework: "astro",
        features: {
            typescript: true,
            tailwind: true,
            eslint: true,
            prettier: true,
            mdx: true,
            seo: true,
            analytics: true
        },
        plugins: ["@devanthos/plugin-seo", "@devanthos/plugin-analytics"],
        dependencies: {
            astro: ["@astrojs/mdx", "@astrojs/sitemap"]
        }
    },
    "mobile-app": {
        name: "Mobile App",
        description: "Aplicación móvil con React Native y Expo",
        framework: "expo",
        features: {
            typescript: true,
            navigation: true,
            stateManagement: true,
            authentication: true
        },
        plugins: ["@devanthos/plugin-expo-auth"],
        dependencies: {
            expo: [
                "@react-navigation/native",
                "@react-navigation/stack",
                "zustand",
                "expo-secure-store"
            ]
        }
    },
    minimal: {
        name: "Minimal",
        description: "Configuración mínima para empezar desde cero",
        framework: null, // Usuario elige
        features: {
            typescript: true,
            tailwind: false,
            eslint: false,
            prettier: false
        },
        plugins: [],
        dependencies: {}
    }
};

/**
 * Clase para gestionar configuración de proyectos
 */
export class ProjectConfig {
    /**
     * Carga configuración desde archivo o usa defaults
     * @param {string} projectPath - Ruta del proyecto
     * @returns {Promise<Object>} Configuración del proyecto
     */
    static async load(projectPath) {
        const configPath = path.join(projectPath, "devanthos.config.js");

        if (!existsSync(configPath)) {
            return { ...DEFAULT_CONFIG };
        }

        try {
            // Intentar importar el archivo de configuración
            const configUrl = `file://${configPath.replace(/\\/g, "/")}`;
            const configModule = await import(configUrl);
            const userConfig = configModule.default || configModule;

            // Merge con configuración por defecto
            return this.merge(DEFAULT_CONFIG, userConfig);
        } catch (error) {
            console.warn(chalk.yellow(`⚠️ Error al cargar devanthos.config.js: ${error.message}`));
            console.warn(chalk.gray("   Usando configuración por defecto"));
            return { ...DEFAULT_CONFIG };
        }
    }

    /**
     * Guarda configuración en archivo
     * @param {string} projectPath - Ruta del proyecto
     * @param {Object} config - Configuración a guardar
     */
    static save(projectPath, config) {
        const configPath = path.join(projectPath, "devanthos.config.js");

        const content = `/**
 * Configuración de Devanthos
 * @see https://docs.devanthos.com/config
 */
export default ${JSON.stringify(config, null, 4)};
`;

        try {
            writeFileSync(configPath, content, "utf-8");
            return { success: true, path: configPath };
        } catch (error) {
            console.error(chalk.red(`❌ Error al guardar configuración: ${error.message}`));
            return { success: false, error: error.message };
        }
    }

    /**
     * Aplica un preset a la configuración
     * @param {string} presetName - Nombre del preset
     * @param {Object} baseConfig - Configuración base
     * @returns {Object} Configuración con preset aplicado
     */
    static applyPreset(presetName, baseConfig = {}) {
        const preset = PRESETS[presetName];

        if (!preset) {
            throw new Error(
                `Preset "${presetName}" no encontrado. Disponibles: ${Object.keys(PRESETS).join(", ")}`
            );
        }

        // Merge preset con configuración base
        return this.merge(DEFAULT_CONFIG, {
            ...baseConfig,
            preset: presetName,
            framework: preset.framework || baseConfig.framework,
            features: { ...DEFAULT_CONFIG.features, ...preset.features },
            plugins: preset.plugins || [],
            _presetMeta: {
                name: preset.name,
                description: preset.description,
                dependencies: preset.dependencies
            }
        });
    }

    /**
     * Merge profundo de objetos
     * @param {Object} target - Objeto objetivo
     * @param {Object} source - Objeto fuente
     * @returns {Object} Objeto merged
     */
    static merge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                result[key] = this.merge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    /**
     * Lista todos los presets disponibles
     * @returns {Array} Lista de presets con metadata
     */
    static listPresets() {
        return Object.entries(PRESETS).map(([key, preset]) => ({
            id: key,
            name: preset.name,
            description: preset.description,
            framework: preset.framework || "cualquiera"
        }));
    }

    /**
     * Obtiene un preset por nombre
     * @param {string} presetName - Nombre del preset
     * @returns {Object|null} Preset o null si no existe
     */
    static getPreset(presetName) {
        return PRESETS[presetName] || null;
    }

    /**
     * Valida una configuración
     * @param {Object} config - Configuración a validar
     * @returns {Object} Resultado de validación
     */
    static validate(config) {
        const errors = [];
        const warnings = [];

        // Validar packageManager
        const validPMs = ["auto", "npm", "pnpm", "yarn", "bun"];
        if (!validPMs.includes(config.packageManager)) {
            errors.push(`packageManager debe ser uno de: ${validPMs.join(", ")}`);
        }

        // Validar framework si está presente
        if (config.framework) {
            const validFrameworks = ["astro", "next", "expo"];
            if (!validFrameworks.includes(config.framework)) {
                errors.push(`framework debe ser uno de: ${validFrameworks.join(", ")}`);
            }
        }

        // Validar estructura de git
        if (config.git && typeof config.git !== "object") {
            errors.push("git debe ser un objeto");
        }

        // Validar plugins (debe ser array)
        if (config.plugins && !Array.isArray(config.plugins)) {
            warnings.push("plugins debe ser un array, se convertirá automáticamente");
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}
