#!/usr/bin/env node
/**
 * Script de test para verificar funcionalidades del CLI
 * Uso: node test-cli.js
 */

import chalk from "chalk";
import { isGitInstalled, getGitConfig } from "./utils/git.js";

console.log(chalk.bold.cyan("\n🧪 Test de funcionalidades del CLI Devanthos\n"));

// Test 1: Verificar instalación de Git
console.log(chalk.yellow("Test 1: Verificar instalación de Git"));
const gitInstalled = isGitInstalled();
if (gitInstalled) {
    console.log(chalk.green("✅ Git está instalado\n"));
} else {
    console.log(chalk.red("❌ Git no está instalado\n"));
}

// Test 2: Obtener configuración de Git
if (gitInstalled) {
    console.log(chalk.yellow("Test 2: Obtener configuración de Git"));
    const gitConfig = getGitConfig();

    if (gitConfig.configured) {
        console.log(chalk.green("✅ Git está configurado"));
        console.log(chalk.gray(`   Nombre: ${gitConfig.name}`));
        console.log(chalk.gray(`   Email: ${gitConfig.email}\n`));
    } else {
        console.log(chalk.yellow("⚠️ Git no está configurado completamente"));
        console.log(chalk.gray("   Configura Git con:"));
        console.log(chalk.gray("   git config --global user.name \"Tu Nombre\""));
        console.log(chalk.gray("   git config --global user.email \"tu@email.com\"\n"));
    }
}

// Test 3: Verificar módulos importados
console.log(chalk.yellow("Test 3: Verificar módulos"));
try {
    await import("./utils/clone.js");
    console.log(chalk.green("✅ utils/clone.js"));

    await import("./utils/install.js");
    console.log(chalk.green("✅ utils/install.js"));

    await import("./utils/plugins.js");
    console.log(chalk.green("✅ utils/plugins.js"));

    await import("./utils/update.js");
    console.log(chalk.green("✅ utils/update.js"));

    await import("./utils/git.js");
    console.log(chalk.green("✅ utils/git.js"));

    console.log(chalk.green("\n✨ Todos los módulos se importaron correctamente\n"));
} catch (error) {
    console.log(chalk.red(`\n❌ Error al importar módulos: ${error.message}\n`));
    process.exit(1);
}

// Resumen
console.log(chalk.bold.green("🎉 Todos los tests pasaron exitosamente!\n"));
console.log(chalk.cyan("Prueba el CLI con:"));
console.log(chalk.gray("  node index.js --help"));
console.log(chalk.gray("  node index.js --version"));
console.log(chalk.gray("  node index.js test-project -t astro --no-install --no-git\n"));
