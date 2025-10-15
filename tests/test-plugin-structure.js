#!/usr/bin/env node

/**
 * Test de Nueva Estructura de Plugins
 *
 * Verifica que los plugins en carpetas tengan la estructura correcta
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import chalk from "chalk";

console.log(chalk.cyan.bold("\n🧪 Test: Nueva Estructura de Plugins\n"));

const pluginsDir = "./plugins";

// Obtener solo directorios (no archivos .js)
const getPluginDirectories = dir => {
    return readdirSync(dir)
        .filter(item => {
            const itemPath = join(dir, item);
            return statSync(itemPath).isDirectory();
        })
        .filter(item => !item.startsWith("."));
};

const pluginDirs = getPluginDirectories(pluginsDir);

console.log(chalk.yellow(`📦 Plugins en formato nuevo: ${pluginDirs.length}\n`));

let allValid = true;

pluginDirs.forEach(pluginName => {
    const pluginPath = join(pluginsDir, pluginName);

    console.log(chalk.cyan(`\n🔍 Validando: ${pluginName}`));

    // Verificar estructura requerida
    const requiredFiles = ["plugin.json"];
    const requiredDirs = ["src"];

    // Archivos opcionales pero recomendados
    const recommendedFiles = [`${pluginName.toUpperCase()}.md`, "README.md"];

    let hasErrors = false;

    // Verificar archivos requeridos
    requiredFiles.forEach(file => {
        const filePath = join(pluginPath, file);
        if (existsSync(filePath)) {
            console.log(chalk.green(`   ✅ ${file}`));
        } else {
            console.log(chalk.red(`   ❌ ${file} - NO ENCONTRADO`));
            hasErrors = true;
        }
    });

    // Verificar directorios requeridos
    requiredDirs.forEach(dir => {
        const dirPath = join(pluginPath, dir);
        if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
            console.log(chalk.green(`   ✅ ${dir}/`));

            // Listar contenido de src/
            const srcFiles = readdirSync(dirPath);
            if (srcFiles.length > 0) {
                console.log(chalk.gray(`      Archivos: ${srcFiles.join(", ")}`));
            } else {
                console.log(chalk.yellow("      ⚠️  Carpeta vacía"));
            }
        } else {
            console.log(chalk.red(`   ❌ ${dir}/ - NO ENCONTRADO`));
            hasErrors = true;
        }
    });

    // Verificar archivos recomendados
    let hasDocsFile = false;
    recommendedFiles.forEach(file => {
        const filePath = join(pluginPath, file);
        if (existsSync(filePath)) {
            console.log(chalk.green(`   ✅ ${file}`));
            hasDocsFile = true;
        }
    });

    if (!hasDocsFile) {
        console.log(chalk.yellow("   ⚠️  Documentación .md no encontrada"));
    }

    // Validar plugin.json
    const pluginJsonPath = join(pluginPath, "plugin.json");
    if (existsSync(pluginJsonPath)) {
        try {
            const pluginData = JSON.parse(readFileSync(pluginJsonPath, "utf-8"));

            // Verificar campos requeridos
            const requiredFields = ["name", "version", "description"];
            const missingFields = requiredFields.filter(field => !pluginData[field]);

            if (missingFields.length === 0) {
                console.log(chalk.green("   ✅ plugin.json válido"));

                // Mostrar metadata
                console.log(chalk.gray(`      Nombre: ${pluginData.name}`));
                console.log(chalk.gray(`      Versión: ${pluginData.version}`));

                if (pluginData.framework) {
                    console.log(chalk.gray(`      Framework: ${pluginData.framework}`));
                } else if (pluginData.frameworks) {
                    console.log(
                        chalk.gray(`      Frameworks: ${pluginData.frameworks.join(", ")}`)
                    );
                }

                if (pluginData.dependencies) {
                    const depCount = Object.keys(pluginData.dependencies).length;
                    console.log(chalk.gray(`      Dependencias: ${depCount}`));
                }

                if (pluginData.files) {
                    const fileCount = Array.isArray(pluginData.files)
                        ? pluginData.files.length
                        : Object.values(pluginData.files).flat().length;
                    console.log(chalk.gray(`      Archivos a copiar: ${fileCount}`));
                }
            } else {
                console.log(chalk.red("   ❌ plugin.json inválido"));
                console.log(chalk.gray(`      Campos faltantes: ${missingFields.join(", ")}`));
                hasErrors = true;
            }
        } catch (error) {
            console.log(chalk.red("   ❌ Error al parsear plugin.json"));
            console.log(chalk.gray(`      ${error.message}`));
            hasErrors = true;
        }
    }

    // Resultado del plugin
    if (!hasErrors) {
        console.log(chalk.green.bold(`\n   ✅ ${pluginName} - Estructura válida`));
    } else {
        console.log(chalk.red.bold(`\n   ❌ ${pluginName} - Estructura inválida`));
        allValid = false;
    }
});

// Resumen final
console.log(chalk.cyan.bold("\n📊 Resumen:\n"));

console.log(chalk.gray(`   Plugins en nueva estructura: ${pluginDirs.length}`));
console.log(
    chalk.gray(
        `   Plugins en formato legacy: ${readdirSync(pluginsDir).filter(f => f.endsWith(".plugin.js")).length}`
    )
);

if (allValid && pluginDirs.length > 0) {
    console.log(chalk.green.bold("\n✅ Todos los plugins tienen estructura válida!\n"));
} else if (pluginDirs.length === 0) {
    console.log(chalk.yellow.bold("\n⚠️  No hay plugins en nueva estructura\n"));
} else {
    console.log(chalk.red.bold("\n❌ Algunos plugins tienen errores\n"));
    process.exit(1);
}

console.log(chalk.cyan("Para ver la nueva estructura:"));
console.log(chalk.gray("  cat plugins/README_NEW.md\n"));
