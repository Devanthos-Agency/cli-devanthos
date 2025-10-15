#!/usr/bin/env node
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { readFileSync } from "fs";
import { cloneTemplate } from "./utils/clone.js";
import { installDeps } from "./utils/install.js";
import { pluginManager } from "./utils/plugins.js";
import { checkForUpdates } from "./utils/update.js";
import { initGitRepo, isGitInstalled } from "./utils/git.js";
import { ProjectConfig, PRESETS } from "./utils/config.js";

// Obtener versión del package.json
const __filename = fileURLToPath(import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"));
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

        // Cargar plugin de actualización de dependencias
        const pluginPath = new URL("./utils/dependency-updater.plugin.js", import.meta.url)
            .pathname;
        const cleanPluginPath =
            process.platform === "win32" && pluginPath.startsWith("/")
                ? pluginPath.substring(1)
                : pluginPath;
        await pluginManager.loadPlugin(cleanPluginPath);

        // Descubrir y cargar plugins adicionales
        const pluginCount = await pluginManager.discoverPlugins();
        if (pluginCount > 1) {
            console.log(chalk.gray(`🔌 ${pluginCount} plugin(s) cargado(s)\n`));
        }

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
                type: "list",
                name: "preset",
                message: "Seleccioná una configuración:",
                choices: answers => {
                    // Filtrar presets por framework seleccionado
                    const presetsForFramework = ProjectConfig.listPresets().filter(
                        preset => preset.framework === answers.framework
                    );

                    // Agregar opción de configuración manual al inicio
                    const choices = [
                        {
                            name: "⚙️ Configuración manual (sin preset)",
                            value: null
                        }
                    ];

                    // Agregar presets disponibles
                    presetsForFramework.forEach(preset => {
                        choices.push({
                            name: `${preset.name} - ${preset.description}`,
                            value: preset.id
                        });
                    });

                    return choices;
                }
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
            },
            {
                type: "confirm",
                name: "saveConfig",
                message: "¿Guardar configuración en devanthos.config.js?",
                default: false,
                when: answers => answers.preset !== null // Solo si eligió un preset
            },
            {
                type: "checkbox",
                name: "selectedPlugins",
                message: "¿Qué plugins querés instalar?",
                when: answers => {
                    if (!answers.preset) return false;
                    const preset = ProjectConfig.applyPreset(answers.preset);
                    return preset.plugins && preset.plugins.length > 0;
                },
                choices: answers => {
                    const preset = ProjectConfig.applyPreset(answers.preset);
                    return preset.plugins.map(pluginName => ({
                        name: pluginName.replace("@devanthos/plugin-", ""),
                        value: pluginName,
                        checked: true // Por defecto todos seleccionados
                    }));
                }
            }
        ]);

        // Determinar si está usando preset
        const usingPreset = answers.preset !== null;
        const {
            framework,
            projectName,
            installDependencies,
            initGit,
            saveConfig,
            selectedPlugins
        } = answers;
        let presetConfig = null;

        if (usingPreset) {
            presetConfig = ProjectConfig.applyPreset(answers.preset);

            // Sobrescribir plugins con los seleccionados por el usuario
            if (selectedPlugins && selectedPlugins.length > 0) {
                presetConfig.plugins = selectedPlugins;
            } else if (selectedPlugins && selectedPlugins.length === 0) {
                // Si no seleccionó ninguno, no instalar plugins
                presetConfig.plugins = [];
            }

            console.log(
                chalk.cyan(`\n✨ Usando preset: ${chalk.bold(presetConfig._presetMeta.name)}`)
            );
            console.log(chalk.gray(`   ${presetConfig._presetMeta.description}\n`));
        }

        const frameworkNames = {
            astro: "Astro",
            next: "Next.js",
            expo: "Expo"
        };

        // Hook: beforeClone
        await pluginManager.executeHook("beforeClone", { framework, projectName });

        console.log(
            chalk.cyan(
                `\n📁 Creando proyecto "${projectName}" con ${frameworkNames[framework]}...\n`
            )
        );

        // Clonar plantilla
        const cloneSpinner = ora({
            text: `Descargando plantilla ${framework}...`,
            color: "cyan"
        }).start();

        try {
            await cloneTemplate(framework, projectName);
            cloneSpinner.succeed(chalk.green("✅ Plantilla descargada exitosamente"));

            // Hook: afterClone (aquí el plugin actualizará las dependencias)
            await pluginManager.executeHook("afterClone", { framework, projectName });
        } catch (error) {
            cloneSpinner.fail(chalk.red("❌ Error al descargar la plantilla"));

            // Hook: onError
            await pluginManager.executeHook("onError", {
                error,
                stage: "clone",
                framework,
                projectName
            });
            throw error;
        }

        // Inicializar Git si se solicita
        if (initGit && isGitInstalled()) {
            const gitSpinner = ora({
                text: "Inicializando repositorio Git...",
                color: "cyan"
            }).start();

            try {
                const gitResult = await initGitRepo(projectName, {
                    initialCommit: true,
                    branch: "main",
                    verbose: false
                });

                if (gitResult.success) {
                    gitSpinner.succeed(chalk.green("✅ Repositorio Git inicializado"));
                } else {
                    gitSpinner.warn(chalk.yellow("⚠️ No se pudo inicializar Git automáticamente"));
                }
            } catch (error) {
                gitSpinner.warn(chalk.yellow("⚠️ Git init falló (no crítico)"));
            }
        }

        // Instalar dependencias si se solicita
        if (installDependencies) {
            // Hook: beforeInstall
            await pluginManager.executeHook("beforeInstall", { projectName });

            console.log(chalk.cyan("\n📦 Instalando dependencias...\n"));

            const installSpinner = ora({
                text: "Instalando paquetes...",
                color: "yellow"
            }).start();

            try {
                await installDeps(projectName);
                installSpinner.succeed(chalk.green("✅ Dependencias instaladas correctamente"));

                // Hook: afterInstall
                await pluginManager.executeHook("afterInstall", { projectName });
            } catch (error) {
                installSpinner.warn(
                    chalk.yellow("⚠️ Hubo un problema con la instalación automática")
                );
                console.log(
                    chalk.gray(`Podés instalar manualmente con: cd ${projectName} && npm install`)
                );

                // Hook: onError
                await pluginManager.executeHook("onError", {
                    error,
                    stage: "install",
                    projectName
                });
            }
        }

        // Guardar configuración si se solicitó
        if (saveConfig && presetConfig) {
            const configSpinner = ora({
                text: "Guardando configuración...",
                color: "cyan"
            }).start();

            try {
                const configResult = ProjectConfig.save(projectName, presetConfig);
                if (configResult.success) {
                    configSpinner.succeed(
                        chalk.green("✅ Configuración guardada en devanthos.config.js")
                    );
                } else {
                    configSpinner.warn(chalk.yellow("⚠️ No se pudo guardar la configuración"));
                }
            } catch (error) {
                configSpinner.warn(chalk.yellow("⚠️ Error al guardar configuración (no crítico)"));
            }
        }

        // Instalar plugins del preset si se definieron
        if (presetConfig && presetConfig.plugins && presetConfig.plugins.length > 0) {
            console.log(
                chalk.cyan(`\n🔌 Instalando ${presetConfig.plugins.length} plugin(s)...\n`)
            );

            const projectPath = path.resolve(process.cwd(), projectName);
            let installedCount = 0;
            let failedCount = 0;

            for (const pluginName of presetConfig.plugins) {
                const pluginSpinner = ora({
                    text: `Instalando ${pluginName}...`,
                    color: "cyan"
                }).start();

                try {
                    await pluginManager.installPlugin(pluginName, projectPath, framework, {
                        verbose: false,
                        skipDependencies: !installDependencies
                    });
                    pluginSpinner.succeed(chalk.green(`✅ ${pluginName} instalado`));
                    installedCount++;
                } catch (error) {
                    pluginSpinner.warn(chalk.yellow(`⚠️ ${pluginName} - ${error.message}`));
                    failedCount++;
                }
            }

            if (installedCount > 0) {
                console.log(
                    chalk.green(`\n✅ ${installedCount} plugin(s) instalado(s) exitosamente`)
                );
            }
            if (failedCount > 0) {
                console.log(
                    chalk.yellow(
                        `⚠️ ${failedCount} plugin(s) no se pudieron instalar automáticamente`
                    )
                );
                console.log(
                    chalk.gray(
                        "   Podés instalarlos manualmente con: npx devanthos-plugins install"
                    )
                );
            }
        }

        // Mensaje de éxito y próximos pasos
        console.log(chalk.green.bold(`\n🎉 ¡Proyecto "${projectName}" creado exitosamente!\n`));

        console.log(chalk.cyan.bold("👉 Próximos pasos:"));
        console.log(chalk.gray(`   cd ${projectName}`));

        if (!installDependencies) {
            console.log(chalk.gray("   npm install  # o pnpm install"));
        }

        console.log(chalk.gray("   npm run dev  # o pnpm dev"));
        console.log(chalk.gray("   # ¡Tu proyecto estará disponible en http://localhost:3000!"));

        console.log(chalk.magenta.bold("\n🚀 ¡Gracias por usar Devanthos! 💜"));
        console.log(chalk.gray("   Documentación: https://docs.devanthos.com"));
        console.log(chalk.gray("   Soporte: https://discord.gg/devanthos\n"));

        // Hook: onComplete
        await pluginManager.executeHook("onComplete", {
            framework,
            projectName,
            installDependencies
        });

        // Forzar salida exitosa después de un breve delay
        setTimeout(() => {
            process.exit(0);
        }, 100);
    } catch (error) {
        console.log(chalk.red.bold("\n❌ Error inesperado:"));
        console.error(chalk.red(error.message));
        console.log(chalk.gray("\n💡 Si el problema persiste, reportalo en:"));
        console.log(chalk.cyan("   https://github.com/devanthos/create-devanthos-app/issues\n"));

        // Hook: onError
        await pluginManager.executeHook("onError", {
            error,
            stage: "main"
        });

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
            saveConfig = false,
            _preset,
            _presetConfig
        } = options;

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

        // Mostrar preset si se está usando
        if (_preset && _presetConfig) {
            console.log(
                chalk.cyan(`\n✨ Usando preset: ${chalk.bold(_presetConfig._presetMeta.name)}`)
            );
            console.log(chalk.gray(`   ${_presetConfig._presetMeta.description}\n`));
        }

        // Chequear actualizaciones si no se saltea
        if (!skipUpdateCheck) {
            await checkForUpdates({ silent: true }).catch(() => {});
        }

        // Cargar plugins
        const pluginPath = new URL("./utils/dependency-updater.plugin.js", import.meta.url)
            .pathname;
        const cleanPluginPath =
            process.platform === "win32" && pluginPath.startsWith("/")
                ? pluginPath.substring(1)
                : pluginPath;
        await pluginManager.loadPlugin(cleanPluginPath);
        await pluginManager.discoverPlugins();

        const frameworkNames = {
            astro: "Astro",
            next: "Next.js",
            expo: "Expo"
        };

        console.log(
            chalk.cyan(
                `\n📁 Creando proyecto "${projectName}" con ${frameworkNames[template]}...\n`
            )
        );

        // Hook: beforeClone
        await pluginManager.executeHook("beforeClone", {
            framework: template,
            projectName
        });

        // Clonar plantilla
        const cloneSpinner = ora({
            text: `Descargando plantilla ${template}...`,
            color: "cyan"
        }).start();

        try {
            await cloneTemplate(template, projectName);
            cloneSpinner.succeed(chalk.green("✅ Plantilla descargada exitosamente"));

            // Hook: afterClone
            await pluginManager.executeHook("afterClone", {
                framework: template,
                projectName
            });
        } catch (error) {
            cloneSpinner.fail(chalk.red("❌ Error al descargar la plantilla"));
            throw error;
        }

        // Inicializar Git si está habilitado
        if (git && isGitInstalled()) {
            const gitSpinner = ora({
                text: "Inicializando repositorio Git...",
                color: "cyan"
            }).start();

            try {
                const gitResult = await initGitRepo(projectName, {
                    initialCommit: true,
                    branch: "main",
                    verbose: false
                });

                if (gitResult.success) {
                    gitSpinner.succeed(chalk.green("✅ Repositorio Git inicializado"));
                } else {
                    gitSpinner.warn(chalk.yellow("⚠️ No se pudo inicializar Git automáticamente"));
                }
            } catch (error) {
                gitSpinner.warn(chalk.yellow("⚠️ Git init falló (no crítico)"));
            }
        }

        // Instalar dependencias si está habilitado
        if (install) {
            await pluginManager.executeHook("beforeInstall", { projectName });

            console.log(chalk.cyan("\n📦 Instalando dependencias...\n"));

            const installSpinner = ora({
                text: "Instalando paquetes...",
                color: "yellow"
            }).start();

            try {
                await installDeps(projectName);
                installSpinner.succeed(chalk.green("✅ Dependencias instaladas correctamente"));

                await pluginManager.executeHook("afterInstall", { projectName });
            } catch (error) {
                installSpinner.warn(
                    chalk.yellow("⚠️ Hubo un problema con la instalación automática")
                );
                console.log(
                    chalk.gray(`Podés instalar manualmente con: cd ${projectName} && npm install`)
                );
            }
        }

        // Guardar configuración si se solicitó
        if (saveConfig && _presetConfig) {
            const configSpinner = ora({
                text: "Guardando configuración...",
                color: "cyan"
            }).start();

            try {
                const configResult = ProjectConfig.save(projectName, _presetConfig);
                if (configResult.success) {
                    configSpinner.succeed(
                        chalk.green("✅ Configuración guardada en devanthos.config.js")
                    );
                } else {
                    configSpinner.warn(chalk.yellow("⚠️ No se pudo guardar la configuración"));
                }
            } catch (error) {
                configSpinner.warn(chalk.yellow("⚠️ Error al guardar configuración (no crítico)"));
            }
        }

        // Instalar plugins del preset si se definieron
        if (_presetConfig && _presetConfig.plugins && _presetConfig.plugins.length > 0) {
            console.log(
                chalk.cyan(
                    `\n🔌 Instalando ${_presetConfig.plugins.length} plugin(s) del preset...\n`
                )
            );

            const projectPath = path.resolve(process.cwd(), projectName);
            let installedCount = 0;
            let failedCount = 0;

            for (const pluginName of _presetConfig.plugins) {
                const pluginSpinner = ora({
                    text: `Instalando ${pluginName}...`,
                    color: "cyan"
                }).start();

                try {
                    await pluginManager.installPlugin(pluginName, projectPath, template, {
                        verbose: false,
                        skipDependencies: !install
                    });
                    pluginSpinner.succeed(chalk.green(`✅ ${pluginName} instalado`));
                    installedCount++;
                } catch (error) {
                    pluginSpinner.warn(chalk.yellow(`⚠️ ${pluginName} - ${error.message}`));
                    failedCount++;
                }
            }

            if (installedCount > 0) {
                console.log(
                    chalk.green(`\n✅ ${installedCount} plugin(s) instalado(s) exitosamente`)
                );
            }
            if (failedCount > 0) {
                console.log(
                    chalk.yellow(
                        `⚠️ ${failedCount} plugin(s) no se pudieron instalar automáticamente`
                    )
                );
                console.log(
                    chalk.gray(
                        "   Podés instalarlos manualmente con: npx devanthos-plugins install"
                    )
                );
            }
        }

        // Mensaje de éxito
        console.log(chalk.green.bold(`\n🎉 ¡Proyecto "${projectName}" creado exitosamente!\n`));

        console.log(chalk.cyan.bold("👉 Próximos pasos:"));
        console.log(chalk.gray(`   cd ${projectName}`));

        if (!install) {
            console.log(chalk.gray("   npm install  # o pnpm install"));
        }

        console.log(chalk.gray("   npm run dev  # o pnpm dev"));

        console.log(chalk.magenta.bold("\n🚀 ¡Gracias por usar Devanthos! 💜\n"));

        // Hook: onComplete
        await pluginManager.executeHook("onComplete", {
            framework: template,
            projectName,
            installDependencies: install
        });

        process.exit(0);
    } catch (error) {
        console.log(chalk.red.bold("\n❌ Error:"));
        console.error(chalk.red(error.message));
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

// Verificar si es llamada directa (no importada)
const isDirectCall = process.argv[1] === __filename;

if (isDirectCall) {
    program.parse(process.argv);
}
