#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { readFileSync } from "fs";
import { checkForUpdates } from "./utils/update.js";
import { isGitInstalled } from "./utils/git.js";
import { ProjectConfig, PRESETS } from "./utils/config.js";
import {
    parseIntegrations,
    validateIntegrations,
    listIntegrations,
    getAvailableIntegrations
} from "./utils/integrations.js";
import { createProject } from "./utils/create-project.js";

// Obtener versión del package.json
const __filename = fileURLToPath(import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"));
const VERSION = packageJson.version;

// Banner ASCII mejorado para Devanthos
const showBanner = () => {
    console.log(
        chalk.bold.magenta(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║                   :::::::::::::                     ║ 
║                   :::::::::::::::                   ║
║                    :::  :::   ::::                  ║
║                    :::   :::: ::::.                 ║
║                    :::   :::: :::::                 ║
║                    :::  :::  :::::                  ║
║                   :::::::::::::::                   ║
║                   :::::::::::::                     ║
║                                                     ║
║                                                     ║
║      🚀 ${chalk.cyan.bold("DEVANTHOS CLI")} - Create Modern Apps          ║
║                                                     ║
║ ${chalk.gray("Plantillas profesionales para Astro, Next.js y Expo")} ║    
╚═════════════════════════════════════════════════════╝
  `)
    );
};

// Validador de nombres de proyecto
const validateProjectName = input => {
    const projectName = input.trim();

    if (!projectName) {
        return "Por favor, ingresa un nombre para el proyecto.";
    }

    // "." significa instalar en el directorio actual
    if (projectName === ".") {
        return true;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
        return "El nombre debe contener solo letras, números, guiones y guiones bajos.";
    }

    if (projectName.startsWith("-") || projectName.startsWith("_")) {
        return "El nombre no puede empezar con guión o guión bajo.";
    }

    if (projectName.length > 50) {
        return "El nombre es demasiado largo (máximo 50 caracteres).";
    }

    return true;
};

// Función principal mejorada con plugins y updates
const main = async () => {
    try {
        showBanner();

        // Chequear actualizaciones (no bloqueante)
        checkForUpdates({ silent: false }).catch(() => {
            // Ignorar errores silenciosamente
        });

        console.log(chalk.cyan("¡Bienvenido al generador de plantillas Devanthos! 👋\n"));

        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "framework",
                message: "¿Qué tipo de proyecto querés crear?",
                choices: [
                    {
                        name: "🌌 Astro - Sitios estáticos y landing pages ultra rápidas",
                        value: "astro"
                    },
                    {
                        name: "⚛️ Next.js - Aplicaciones dinámicas, dashboards y SaaS",
                        value: "next"
                    },
                    {
                        name: "📱 Expo - Aplicaciones móviles con React Native",
                        value: "expo"
                    }
                ]
            },
            {
                type: "input",
                name: "projectName",
                message: "¿Cuál será el nombre de tu proyecto?",
                default: "mi-proyecto-devanthos",
                validate: validateProjectName,
                filter: input => input.trim().toLowerCase()
            },
            {
                type: "checkbox",
                name: "selectedIntegrations",
                message: "¿Qué integraciones querés agregar?",
                choices: answers => {
                    const available = getAvailableIntegrations(answers.framework);
                    return available.map(i => ({
                        name: `${i.name} - ${i.description}`,
                        value: i.id,
                        short: i.name
                    }));
                },
                when: answers => {
                    const available = getAvailableIntegrations(answers.framework);
                    return available.length > 0;
                }
            },
            {
                type: "confirm",
                name: "installDependencies",
                message: "¿Querés instalar las dependencias automáticamente?",
                default: true
            },
            {
                type: "confirm",
                name: "initGit",
                message: "¿Inicializar repositorio Git?",
                default: true,
                when: () => isGitInstalled()
            }
        ]);

        const {
            framework,
            projectName,
            installDependencies,
            initGit,
            selectedIntegrations = []
        } = answers;

        await createProject({
            framework,
            projectName,
            selectedIntegrations,
            installDependencies,
            initGit
        });

        // Forzar salida exitosa después de un breve delay
        setTimeout(() => {
            process.exit(0);
        }, 100);
    } catch (error) {
        console.log(chalk.red.bold("\n❌ Error inesperado:"));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        console.log(chalk.gray("\n💡 Si el problema persiste, reportalo en:"));
        console.log(chalk.cyan("   https://github.com/devanthos/create-devanthos-app/issues\n"));

        process.exit(1);
    }
};

// Función para crear proyecto en modo no-interactivo (CLI flags)
const createProjectNonInteractive = async (projectName, options) => {
    try {
        const {
            template,
            install = true,
            git = true,
            skipUpdateCheck = false,
            integration
        } = options;

        // Parsear integraciones si se especificaron
        const requestedIntegrations = parseIntegrations(integration);

        // Validar template
        const validTemplates = ["astro", "next", "expo"];
        if (!validTemplates.includes(template)) {
            console.log(chalk.red(`\n❌ Template inválido: "${template}"\n`));
            console.log(chalk.cyan("Templates disponibles:"));
            console.log(chalk.gray("  • astro  - Sitios estáticos y landing pages"));
            console.log(chalk.gray("  • next   - Aplicaciones web dinámicas"));
            console.log(chalk.gray("  • expo   - Aplicaciones móviles\n"));
            process.exit(1);
        }

        // Validar nombre del proyecto
        const validation = validateProjectName(projectName);
        if (validation !== true) {
            console.log(chalk.red(`\n❌ ${validation}\n`));
            process.exit(1);
        }

        showBanner();

        // Chequear actualizaciones si no se saltea
        if (!skipUpdateCheck) {
            await checkForUpdates({ silent: true }).catch(() => {});
        }

        // Validar y resolver integraciones
        let validIntegrations = /** @type {any[]} */ ([]);
        if (requestedIntegrations.length > 0) {
            const { valid, errors } = validateIntegrations(requestedIntegrations, template);
            if (errors.length > 0) {
                for (const err of errors) {
                    console.log(chalk.yellow(`  ⚠️ ${err.error}`));
                }
            }
            validIntegrations = valid;
        }

        await createProject({
            framework: template,
            projectName,
            selectedIntegrations: /** @type {any[]} */ (validIntegrations),
            installDependencies: install,
            initGit: git
        });

        process.exit(0);
    } catch (error) {
        console.log(chalk.red.bold("\n❌ Error:"));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
};

// Configurar CLI con Commander
const program = new Command();

program
    .name("create-devanthos-app")
    .description("CLI oficial para crear proyectos con plantillas Devanthos")
    .version(VERSION)
    .argument("[project-name]", "Nombre del proyecto")
    .option("-t, --template <framework>", "Framework: astro, next, expo")
    .option(
        "-p, --preset <preset>",
        "Preset: landing-page, dashboard, blog, ecommerce, portfolio, mobile-app, minimal"
    )
    .option("--no-install", "No instalar dependencias automáticamente")
    .option("--no-git", "No inicializar repositorio Git")
    .option("--skip-update-check", "Saltar verificación de actualizaciones")
    .option("--save-config", "Guardar configuración en devanthos.config.js")
    .option(
        "-i, --integration <integrations>",
        "Integraciones: mercadopago, auth, mongodb (separadas por coma)"
    )
    .action(async (projectName, options) => {
        // Si no hay argumentos, mostrar wizard interactivo
        if (!projectName && !options.template && !options.preset) {
            return main();
        }

        // Si falta el nombre del proyecto
        if (!projectName) {
            console.log(chalk.red("\n❌ Debes especificar un nombre de proyecto\n"));
            console.log(chalk.cyan("Ejemplos:"));
            console.log(chalk.gray("  npx create-devanthos-app mi-proyecto -t astro"));
            console.log(chalk.gray("  npx create-devanthos-app mi-blog -p blog\n"));
            process.exit(1);
        }

        // Si tiene preset, no necesita template
        if (options.preset) {
            const validPresets = Object.keys(PRESETS);
            if (!validPresets.includes(options.preset)) {
                console.log(chalk.red(`\n❌ Preset inválido: "${options.preset}"\n`));
                console.log(chalk.cyan("Presets disponibles:"));
                ProjectConfig.listPresets().forEach(p => {
                    console.log(chalk.gray(`  • ${p.id.padEnd(15)} - ${p.description}`));
                });
                console.log();
                process.exit(1);
            }

            // Aplicar preset y extraer framework
            const presetConfig = ProjectConfig.applyPreset(options.preset);
            options.template = presetConfig.framework;
            options._preset = options.preset;
            options._presetConfig = presetConfig;
        }

        // Si falta el template (y no hay preset)
        if (!options.template) {
            console.log(
                chalk.red("\n❌ Debes especificar un template con -t o un preset con -p\n")
            );
            console.log(chalk.cyan("Ejemplos:"));
            console.log(chalk.gray("  npx create-devanthos-app mi-proyecto -t astro"));
            console.log(chalk.gray("  npx create-devanthos-app mi-blog -p blog\n"));
            process.exit(1);
        }

        // Crear proyecto en modo no-interactivo
        await createProjectNonInteractive(projectName, options);
    });

// Comando adicional para listar presets
program
    .command("list-presets")
    .description("Listar todos los presets disponibles")
    .action(() => {
        console.log(chalk.cyan.bold("\n📦 Presets Disponibles:\n"));

        ProjectConfig.listPresets().forEach(preset => {
            console.log(chalk.bold(`  ${preset.name}`));
            console.log(chalk.gray(`  ID: ${preset.id}`));
            console.log(chalk.gray(`  Framework: ${preset.framework}`));
            console.log(chalk.gray(`  ${preset.description}`));
            console.log();
        });

        console.log(chalk.cyan("Uso:"));
        console.log(chalk.gray("  npx create-devanthos-app mi-proyecto -p <preset-id>\n"));
    });

// Comando para listar integraciones disponibles
program
    .command("list-integrations")
    .alias("list-i")
    .description("Listar todas las integraciones disponibles")
    .option("-f, --framework <framework>", "Filtrar por framework: next, astro, expo")
    .action(options => {
        console.log(chalk.cyan.bold("\n🔌 Integraciones Disponibles:\n"));

        const integrations = listIntegrations(options.framework);

        if (integrations.length === 0) {
            console.log(chalk.yellow("  No hay integraciones disponibles para este framework.\n"));
            return;
        }

        integrations.forEach(integration => {
            console.log(chalk.bold(`  ${integration.name}`));
            console.log(chalk.gray(`  ID: ${integration.id}`));
            console.log(chalk.gray(`  Frameworks: ${integration.frameworks.join(", ")}`));
            console.log(chalk.gray(`  Dependencias: ${integration.dependencies.join(", ")}`));
            console.log(chalk.gray(`  ${integration.description}`));
            console.log();
        });

        console.log(chalk.cyan("Uso:"));
        console.log(chalk.gray("  npx create-devanthos-app mi-proyecto -t next -i mercadopago"));
        console.log(
            chalk.gray("  npx create-devanthos-app mi-proyecto -t next -i mercadopago,auth,mongodb")
        );
        console.log(chalk.gray("  npx create-devanthos-app mi-proyecto -t next -i mp  # alias\n"));

        console.log(chalk.cyan("Aliases disponibles:"));
        console.log(chalk.gray("  • mp, mercado, pago → mercadopago"));
        console.log(chalk.gray("  • auth, login, nextauth → auth"));
        console.log(chalk.gray("  • mongo, db, database → mongodb\n"));
    });

// Verificar si es llamada directa (no importada)
const isDirectCall = process.argv[1] === __filename;

if (isDirectCall) {
    program.parse(process.argv);
}
