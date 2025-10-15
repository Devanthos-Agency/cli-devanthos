#!/usr/bin/env node
import { pluginManager } from "../utils/plugins.js";
import chalk from "chalk";
import { existsSync } from "fs";
import path from "path";

console.log(chalk.cyan.bold("\n🧪 Test: Plugin Loader v2.0 (Modular Structure)\n"));

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

const assert = (condition, message) => {
    testsRun++;
    if (condition) {
        testsPassed++;
        console.log(chalk.green(`✓ ${message}`));
    } else {
        testsFailed++;
        console.log(chalk.red(`✗ ${message}`));
    }
};

const runTests = async () => {
    try {
        // Test 1: Descubrir plugins
        console.log(chalk.yellow("\n1. Descubrimiento de Plugins\n"));

        const pluginCount = await pluginManager.discoverPlugins();
        assert(pluginCount > 0, `Plugins descubiertos: ${pluginCount}`);

        // Test 2: Validar que se cargaron plugins modulares
        console.log(chalk.yellow("\n2. Plugins Modulares Cargados\n"));

        const modularPlugins = [
            "@devanthos/plugin-analytics",
            "@devanthos/plugin-auth",
            "@devanthos/plugin-database",
            "@devanthos/plugin-content",
            "@devanthos/plugin-seo",
            "@devanthos/plugin-stripe",
            "@devanthos/plugin-expo-auth",
            "@devanthos/plugin-mercadopago"
        ];

        let modularCount = 0;
        for (const pluginName of modularPlugins) {
            const plugin = pluginManager.getPlugin(pluginName);
            if (plugin) {
                assert(true, `Plugin ${pluginName} cargado`);
                assert(plugin._isModular === true, "  └─ Es plugin modular");
                assert(plugin.version !== undefined, `  └─ Tiene versión: ${plugin.version}`);
                assert(
                    plugin.frameworks !== undefined,
                    `  └─ Define frameworks: ${plugin.frameworks.join(", ")}`
                );
                modularCount++;
            }
        }

        assert(modularCount === 8, `Total plugins modulares: ${modularCount}/8`);

        // Test 3: Validar estructura de plugins
        console.log(chalk.yellow("\n3. Estructura de Plugins\n"));

        const testPlugin = pluginManager.getPlugin("@devanthos/plugin-analytics");
        if (testPlugin) {
            assert(testPlugin.name === "@devanthos/plugin-analytics", "Nombre correcto");
            assert(testPlugin.version !== undefined, "Tiene versión");
            assert(testPlugin.description !== undefined, "Tiene descripción");
            assert(Array.isArray(testPlugin.frameworks), "Frameworks es un array");
            assert(testPlugin.dependencies !== undefined, "Tiene dependencias");
            assert(Array.isArray(testPlugin.files), "Files es un array");
            assert(testPlugin._pluginDir !== undefined, "Tiene directorio del plugin");
        }

        // Test 4: Validar plugin Mercado Pago
        console.log(chalk.yellow("\n4. Plugin Mercado Pago (Nuevo)\n"));

        const mercadopagoPlugin = pluginManager.getPlugin("@devanthos/plugin-mercadopago");
        if (mercadopagoPlugin) {
            assert(mercadopagoPlugin.name === "@devanthos/plugin-mercadopago", "Nombre correcto");
            assert(mercadopagoPlugin.version === "1.0.0", "Versión correcta");
            assert(mercadopagoPlugin.frameworks.includes("next"), "Soporta Next.js");
            assert(
                mercadopagoPlugin.files.length === 5,
                `Tiene 5 archivos: ${mercadopagoPlugin.files.length}`
            );
            assert(Array.isArray(mercadopagoPlugin.envVars), "Tiene variables de entorno");
            assert(
                mercadopagoPlugin.envVars.length === 3,
                `3 variables de entorno: ${mercadopagoPlugin.envVars.length}`
            );
            assert(mercadopagoPlugin.postInstall !== null, "Tiene instrucciones post-install");
            assert(Array.isArray(mercadopagoPlugin.features), "Tiene features");
            assert(
                mercadopagoPlugin.features.length === 8,
                `8 features: ${mercadopagoPlugin.features.length}`
            );

            // Validar que los archivos fuente existan
            const pluginDir = mercadopagoPlugin._pluginDir;
            for (const fileConfig of mercadopagoPlugin.files) {
                const filePath = path.join(pluginDir, fileConfig.source);
                assert(existsSync(filePath), `  └─ Archivo existe: ${fileConfig.source}`);
            }
        } else {
            assert(false, "Plugin Mercado Pago no encontrado");
        }

        // Test 5: Listar plugins disponibles
        console.log(chalk.yellow("\n5. Listar Plugins por Framework\n"));

        const nextPlugins = pluginManager.listAvailablePlugins("next");
        assert(nextPlugins.length > 0, `Plugins para Next.js: ${nextPlugins.length}`);

        const astroPlugins = pluginManager.listAvailablePlugins("astro");
        assert(astroPlugins.length > 0, `Plugins para Astro: ${astroPlugins.length}`);

        const expoPlugins = pluginManager.listAvailablePlugins("expo");
        assert(expoPlugins.length > 0, `Plugins para Expo: ${expoPlugins.length}`);

        // Test 6: Validar plugin.json de todos los plugins
        console.log(chalk.yellow("\n6. Validar Metadata (plugin.json)\n"));

        const allPlugins = pluginManager.listAvailablePlugins();
        for (const plugin of allPlugins) {
            const fullPlugin = pluginManager.getPlugin(plugin.name);
            if (fullPlugin && fullPlugin._pluginDir) {
                const jsonPath = path.join(fullPlugin._pluginDir, "plugin.json");
                assert(existsSync(jsonPath), `  └─ ${plugin.name}: plugin.json existe`);
            }
        }

        // Test 7: Validar compatibilidad con legacy plugins
        console.log(chalk.yellow("\n7. Compatibilidad Legacy\n"));

        const allLoadedPlugins = pluginManager.listPlugins();
        assert(
            allLoadedPlugins.length >= 8,
            `Total plugins (modular + legacy): ${allLoadedPlugins.length}`
        );

        // Resumen
        console.log(chalk.cyan.bold("\n📊 Resumen de Tests:\n"));
        console.log(chalk.white(`  Total:  ${testsRun}`));
        console.log(chalk.green(`  Passed: ${testsPassed}`));

        if (testsFailed > 0) {
            console.log(chalk.red(`  Failed: ${testsFailed}`));
        }

        const percentage = ((testsPassed / testsRun) * 100).toFixed(1);
        console.log(chalk.cyan(`  Éxito:  ${percentage}%\n`));

        if (testsFailed === 0) {
            console.log(chalk.green.bold("✅ Todos los tests pasaron!\n"));
            process.exit(0);
        } else {
            console.log(chalk.red.bold("❌ Algunos tests fallaron\n"));
            process.exit(1);
        }
    } catch (error) {
        console.error(chalk.red.bold("\n❌ Error ejecutando tests:"));
        console.error(chalk.red(error.message));
        console.error(error.stack);
        process.exit(1);
    }
};

runTests();
