#!/usr/bin/env node
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { cloneTemplate } from "./utils/clone.js";
import { installDeps } from "./utils/install.js";

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
║     ${chalk.gray("Plantillas profesionales para Astro & Next.js")}   ║    
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

// Función principal mejorada
const main = async () => {
    try {
        showBanner();

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
                type: "confirm",
                name: "installDependencies",
                message: "¿Querés instalar las dependencias automáticamente?",
                default: true
            }
        ]);

        const { framework, projectName, installDependencies } = answers;

        console.log(
            chalk.cyan(
                `\n📁 Creando proyecto "${projectName}" con ${framework === "astro" ? "Astro" : "Next.js"}...\n`
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
        } catch (error) {
            cloneSpinner.fail(chalk.red("❌ Error al descargar la plantilla"));
            throw error;
        }

        // Instalar dependencias si se solicita
        if (installDependencies) {
            console.log(chalk.cyan("\n📦 Instalando dependencias...\n"));

            const installSpinner = ora({
                text: "Instalando paquetes...",
                color: "yellow"
            }).start();

            try {
                await installDeps(projectName);
                installSpinner.succeed(chalk.green("✅ Dependencias instaladas correctamente"));
            } catch (error) {
                installSpinner.warn(
                    chalk.yellow("⚠️ Hubo un problema con la instalación automática")
                );
                console.log(
                    chalk.gray(`Podés instalar manualmente con: cd ${projectName} && npm install`)
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

        // Forzar salida exitosa después de un breve delay
        setTimeout(() => {
            process.exit(0);
        }, 100);
    } catch (error) {
        console.log(chalk.red.bold("\n❌ Error inesperado:"));
        console.error(chalk.red(error.message));
        console.log(chalk.gray("\n💡 Si el problema persiste, reportalo en:"));
        console.log(chalk.cyan("   https://github.com/devanthos/create-devanthos-app/issues\n"));
        process.exit(1);
    }
};

// Verificar si es llamada directa (no importada)
const __filename = fileURLToPath(import.meta.url);
const isDirectCall = process.argv[1] === __filename;

if (isDirectCall) {
    main().catch(error => {
        console.error(chalk.red("Error fatal:"), error);
        process.exit(1);
    });
}
