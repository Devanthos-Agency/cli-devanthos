#!/usr/bin/env node
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { Command } from "commander";
import { pluginManager } from "./utils/plugins.js";

const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));
const VERSION = packageJson.version;

/**
 * Detectar framework del proyecto actual
 */
const detectFramework = projectPath => {
    const packageJsonPath = path.join(projectPath, "package.json");

    if (!existsSync(packageJsonPath)) {
        return null;
    }

    try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        // Detectar Next.js
        if (deps.next) {
            return "next";
        }

        // Detectar Astro
        if (deps.astro) {
            return "astro";
        }

        // Detectar Expo
        if (deps.expo) {
            return "expo";
        }

        return null;
    } catch (error) {
        return null;
    }
};

/**
 * Mostrar banner de plugin installer
 */
const showBanner = () => {
    console.log(
        chalk.bold.magenta(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║  🔌 ${chalk.cyan.bold("DEVANTHOS PLUGIN INSTALLER")}                  ║
║                                                     ║
║  ${chalk.gray("Instala plugins en tus proyectos existentes")}      ║
╚═════════════════════════════════════════════════════╝
  `)
    );
};

/**
 * Modo interactivo
 */
const interactiveMode = async projectPath => {
    showBanner();

    // Detectar framework
    const spinner = ora("Analizando proyecto...").start();
    const framework = detectFramework(projectPath);

    if (!framework) {
        spinner.fail(chalk.red("No se pudo detectar el framework del proyecto"));
        console.log(
            chalk.gray("\nEste directorio no parece ser un proyecto Next.js, Astro o Expo.")
        );
        console.log(chalk.gray("Asegúrate de estar en la raíz del proyecto.\n"));
        process.exit(1);
    }

    spinner.succeed(chalk.green(`Framework detectado: ${framework}`));

    // Cargar plugins disponibles
    const loadSpinner = ora("Cargando plugins...").start();
    await pluginManager.discoverPlugins();
    loadSpinner.succeed(chalk.green("Plugins cargados"));

    const availablePlugins = pluginManager.listAvailablePlugins(framework);

    if (availablePlugins.length === 0) {
        console.log(chalk.yellow(`\n⚠️  No hay plugins disponibles para ${framework}\n`));
        process.exit(0);
    }

    // Preguntar qué plugin instalar
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "plugin",
            message: "¿Qué plugin querés instalar?",
            choices: availablePlugins.map(p => ({
                name: `${p.name} - ${p.description}`,
                value: p.name,
                short: p.name
            }))
        },
        {
            type: "confirm",
            name: "skipDeps",
            message: "¿Saltar instalación de dependencias?",
            default: false
        }
    ]);

    const { plugin, skipDeps } = answers;

    // Instalar plugin
    console.log(chalk.cyan(`\n🚀 Instalando plugin ${plugin}...\n`));

    const installSpinner = ora("Instalando plugin...").start();

    try {
        const results = await pluginManager.installPlugin(plugin, projectPath, framework, {
            verbose: true,
            skipDependencies: skipDeps
        });

        installSpinner.succeed(chalk.green("✅ Plugin instalado exitosamente"));

        // Mostrar resumen
        console.log(chalk.cyan.bold("\n📊 Resumen:"));

        if (results.filesCopied.length > 0) {
            console.log(chalk.green(`\n✓ Archivos copiados (${results.filesCopied.length}):`));
            results.filesCopied.forEach(file => {
                console.log(chalk.gray(`   • ${file}`));
            });
        }

        if (results.dependenciesInstalled.length > 0) {
            console.log(
                chalk.green(
                    `\n✓ Dependencias instaladas (${results.dependenciesInstalled.length}):`
                )
            );
            results.dependenciesInstalled.forEach(dep => {
                console.log(chalk.gray(`   • ${dep}`));
            });
        }

        if (results.envVarsNeeded.length > 0) {
            console.log(chalk.yellow("\n⚠️  Variables de entorno requeridas:"));
            results.envVarsNeeded.forEach(envVar => {
                console.log(chalk.gray(`   • ${envVar}`));
            });
            console.log(chalk.gray("\n   Agrégalas a tu archivo .env"));
        }

        if (results.errors.length > 0) {
            console.log(chalk.red(`\n⚠️  Errores (${results.errors.length}):`));
            results.errors.forEach(error => {
                console.log(chalk.gray(`   • ${error}`));
            });
        }

        console.log(chalk.magenta.bold("\n🎉 ¡Listo! El plugin está instalado.\n"));
    } catch (error) {
        installSpinner.fail(chalk.red("Error al instalar plugin"));
        console.error(chalk.red(`\n${error.message}\n`));
        process.exit(1);
    }
};

/**
 * Listar plugins disponibles
 */
const listPlugins = async framework => {
    const spinner = ora("Cargando plugins...").start();
    await pluginManager.discoverPlugins();
    spinner.succeed();

    const plugins = pluginManager.listAvailablePlugins(framework);

    if (plugins.length === 0) {
        console.log(
            chalk.yellow(
                `\n⚠️  No hay plugins disponibles${framework ? ` para ${framework}` : ""}\n`
            )
        );
        return;
    }

    console.log(
        chalk.cyan.bold(`\n📦 Plugins Disponibles${framework ? ` para ${framework}` : ""}:\n`)
    );

    plugins.forEach(plugin => {
        console.log(chalk.bold(`  ${plugin.name}`));
        console.log(chalk.gray(`  Versión: ${plugin.version}`));
        console.log(chalk.gray(`  Frameworks: ${plugin.frameworks.join(", ")}`));
        console.log(chalk.gray(`  ${plugin.description}`));

        if (plugin.features && plugin.features.length > 0) {
            console.log(chalk.cyan("  Características:"));
            plugin.features.slice(0, 3).forEach(feature => {
                console.log(chalk.gray(`    • ${feature}`));
            });
            if (plugin.features.length > 3) {
                console.log(chalk.gray(`    ... y ${plugin.features.length - 3} más`));
            }
        }

        console.log();
    });

    console.log(chalk.cyan("Uso:"));
    console.log(chalk.gray("  npx devanthos-plugins install <plugin-name>\n"));
};

/**
 * Modo CLI
 */
const program = new Command();

program.name("devanthos-plugins").description("Instalador de plugins Devanthos").version(VERSION);

program
    .command("install [plugin-name]")
    .description("Instalar un plugin en el proyecto actual")
    .option("-p, --path <path>", "Ruta del proyecto", process.cwd())
    .option("-f, --framework <framework>", "Framework (astro, next, expo)")
    .option("--skip-deps", "Saltar instalación de dependencias")
    .action(async (pluginName, options) => {
        const projectPath = path.resolve(options.path);

        if (!existsSync(projectPath)) {
            console.log(chalk.red(`\n❌ Directorio no encontrado: ${projectPath}\n`));
            process.exit(1);
        }

        // Modo interactivo si no se especifica plugin
        if (!pluginName) {
            return interactiveMode(projectPath);
        }

        // Detectar framework
        const framework = options.framework || detectFramework(projectPath);

        if (!framework) {
            console.log(chalk.red("\n❌ No se pudo detectar el framework"));
            console.log(chalk.gray("Especifícalo con --framework <framework>\n"));
            process.exit(1);
        }

        // Cargar plugins
        const spinner = ora("Cargando plugins...").start();
        await pluginManager.discoverPlugins();
        spinner.stop();

        // Instalar plugin
        console.log(
            chalk.cyan(`\n🚀 Instalando plugin ${pluginName} en proyecto ${framework}...\n`)
        );

        try {
            const results = await pluginManager.installPlugin(pluginName, projectPath, framework, {
                verbose: true,
                skipDependencies: options.skipDeps
            });

            console.log(chalk.green.bold("\n✅ Plugin instalado exitosamente\n"));

            if (results.envVarsNeeded.length > 0) {
                console.log(chalk.yellow("⚠️  No olvides configurar las variables de entorno:"));
                results.envVarsNeeded.forEach(envVar => {
                    console.log(chalk.gray(`   • ${envVar}`));
                });
                console.log();
            }
        } catch (error) {
            console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
            process.exit(1);
        }
    });

program
    .command("list")
    .description("Listar plugins disponibles")
    .option("-f, --framework <framework>", "Filtrar por framework")
    .action(async options => {
        await listPlugins(options.framework);
    });

program.parse(process.argv);
