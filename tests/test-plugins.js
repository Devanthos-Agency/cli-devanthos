#!/usr/bin/env node

/**
 * Test de Plugins
 *
 * Verifica que todos los plugins se carguen correctamente
 */

import chalk from "chalk";
import {
    AVAILABLE_PLUGINS,
    listPlugins,
    getPlugin,
    hasPlugin,
    getPluginsByFramework
} from "../plugins/index.js";

console.log(chalk.cyan.bold("\n🧪 Test: Plugin System\n"));

// Test 1: Verificar que todos los plugins se carguen
console.log(chalk.yellow("📦 Test 1: Carga de Plugins"));

const expectedPlugins = [
    "@devanthos/plugin-analytics",
    "@devanthos/plugin-seo",
    "@devanthos/plugin-auth",
    "@devanthos/plugin-database",
    "@devanthos/plugin-content",
    "@devanthos/plugin-stripe",
    "@devanthos/plugin-expo-auth"
];

let allPluginsLoaded = true;

expectedPlugins.forEach(pluginName => {
    if (hasPlugin(pluginName)) {
        console.log(chalk.green(`   ✅ ${pluginName}`));
    } else {
        console.log(chalk.red(`   ❌ ${pluginName} - NO ENCONTRADO`));
        allPluginsLoaded = false;
    }
});

if (allPluginsLoaded) {
    console.log(chalk.green.bold("\n   ✅ Todos los plugins cargados correctamente\n"));
} else {
    console.log(chalk.red.bold("\n   ❌ Algunos plugins no se cargaron\n"));
    process.exit(1);
}

// Test 2: Verificar estructura de plugins
console.log(chalk.yellow("🔍 Test 2: Estructura de Plugins"));

let allPluginsValid = true;

Object.entries(AVAILABLE_PLUGINS).forEach(([name, plugin]) => {
    const hasName = !!plugin.name;
    const hasVersion = !!plugin.version;
    const hasDescription = !!plugin.description;
    const hasAfterClone = typeof plugin.afterClone === "function";

    const valid = hasName && hasVersion && hasDescription && hasAfterClone;

    if (valid) {
        console.log(chalk.green(`   ✅ ${name} - Estructura válida`));
    } else {
        console.log(chalk.red(`   ❌ ${name} - Estructura inválida`));
        if (!hasName) console.log(chalk.gray("      - Falta: name"));
        if (!hasVersion) console.log(chalk.gray("      - Falta: version"));
        if (!hasDescription) console.log(chalk.gray("      - Falta: description"));
        if (!hasAfterClone) console.log(chalk.gray("      - Falta: afterClone()"));
        allPluginsValid = false;
    }
});

if (allPluginsValid) {
    console.log(chalk.green.bold("\n   ✅ Todos los plugins tienen estructura válida\n"));
} else {
    console.log(chalk.red.bold("\n   ❌ Algunos plugins tienen estructura inválida\n"));
    process.exit(1);
}

// Test 3: Verificar plugins por framework
console.log(chalk.yellow("🎯 Test 3: Plugins por Framework"));

const frameworks = ["astro", "next", "expo"];

frameworks.forEach(framework => {
    const plugins = getPluginsByFramework(framework);
    console.log(chalk.cyan(`\n   ${framework.toUpperCase()}:`));

    if (plugins.length > 0) {
        plugins.forEach(plugin => {
            console.log(chalk.gray(`   • ${plugin.name}`));
        });
        console.log(chalk.green(`   ✅ ${plugins.length} plugin(s) disponibles`));
    } else {
        console.log(chalk.yellow(`   ⚠️  No hay plugins específicos para ${framework}`));
    }
});

// Test 4: Probar funciones auxiliares
console.log(chalk.yellow("\n🛠️  Test 4: Funciones Auxiliares"));

// getPlugin()
const analyticsPlugin = getPlugin("@devanthos/plugin-analytics");
if (analyticsPlugin && analyticsPlugin.name === "@devanthos/plugin-analytics") {
    console.log(chalk.green("   ✅ getPlugin() funciona correctamente"));
} else {
    console.log(chalk.red("   ❌ getPlugin() falló"));
    process.exit(1);
}

// listPlugins()
const pluginList = listPlugins();
if (pluginList.length === expectedPlugins.length) {
    console.log(chalk.green("   ✅ listPlugins() funciona correctamente"));
} else {
    console.log(
        chalk.red(
            `   ❌ listPlugins() devolvió ${pluginList.length} plugins, esperados: ${expectedPlugins.length}`
        )
    );
    process.exit(1);
}

// hasPlugin()
if (hasPlugin("@devanthos/plugin-analytics") && !hasPlugin("@devanthos/plugin-fake")) {
    console.log(chalk.green("   ✅ hasPlugin() funciona correctamente"));
} else {
    console.log(chalk.red("   ❌ hasPlugin() falló"));
    process.exit(1);
}

// Test 5: Resumen
console.log(chalk.cyan.bold("\n📊 Resumen:\n"));

console.log(chalk.gray(`   Plugins totales: ${Object.keys(AVAILABLE_PLUGINS).length}`));
console.log(chalk.gray(`   Plugins para Astro: ${getPluginsByFramework("astro").length}`));
console.log(chalk.gray(`   Plugins para Next.js: ${getPluginsByFramework("next").length}`));
console.log(chalk.gray(`   Plugins para Expo: ${getPluginsByFramework("expo").length}`));

console.log(chalk.green.bold("\n✅ Todos los tests pasaron exitosamente!\n"));

console.log(chalk.cyan("Para ver la documentación de plugins:"));
console.log(chalk.gray("  cat plugins/README.md\n"));
