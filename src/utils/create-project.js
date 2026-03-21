import ora from "ora";
import chalk from "chalk";
import path from "path";
import { cloneTemplate } from "./clone.js";
import { installDeps } from "./install.js";
import { initGitRepo, isGitInstalled } from "./git.js";
import { copyIntegration, appendEnvVars } from "./integrations.js";

const FRAMEWORK_NAMES = {
    astro: "Astro",
    next: "Next.js",
    expo: "Expo"
};

/**
 * @param {{ framework: string, projectName: string, selectedIntegrations?: any[], installDependencies?: boolean, initGit?: boolean }} options
 */
export async function createProject({
    framework,
    projectName,
    selectedIntegrations = [],
    installDependencies = true,
    initGit = true
}) {
    console.log(
        chalk.cyan(
            `\n📁 Creando proyecto ${projectName === "." ? "en el directorio actual" : `"${projectName}"`} con ${FRAMEWORK_NAMES[framework]}...\n`
        )
    );

    // Clonar plantilla
    const cloneSpinner = ora({
        text: `Copiando plantilla ${framework}...`,
        color: "cyan"
    }).start();

    try {
        await cloneTemplate(framework, projectName);
        cloneSpinner.succeed(chalk.green("✅ Plantilla copiada exitosamente"));
    } catch (error) {
        cloneSpinner.fail(chalk.red("❌ Error al copiar la plantilla"));
        throw error;
    }

    // Copiar integraciones seleccionadas
    const projectPath = path.resolve(process.cwd(), projectName);
    const addedIntegrations = [];
    const allEnvVars = [];
    const allDependencies = [];

    if (selectedIntegrations.length > 0) {
        const integrationSpinner = ora({
            text: `Agregando ${selectedIntegrations.length} integración(es)...`,
            color: "magenta"
        }).start();

        try {
            for (const integrationId of selectedIntegrations) {
                const id = typeof integrationId === "string" ? integrationId : integrationId.id;
                const result = await copyIntegration(framework, id, projectPath);
                addedIntegrations.push(result.integration);
                allEnvVars.push(...result.envVars);
                allDependencies.push(...result.dependencies);
            }

            if (allEnvVars.length > 0) {
                appendEnvVars(projectPath, allEnvVars);
            }

            integrationSpinner.succeed(
                chalk.green(
                    `✅ ${addedIntegrations.length} integración(es) agregada(s): ${addedIntegrations.map(i => i.name).join(", ")}`
                )
            );
        } catch (error) {
            integrationSpinner.warn(
                chalk.yellow(
                    `⚠️ Error al agregar integraciones: ${error instanceof Error ? error.message : String(error)}`
                )
            );
        }
    }

    // Inicializar Git
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

    // Instalar dependencias
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
            installSpinner.warn(chalk.yellow("⚠️ Hubo un problema con la instalación automática"));
            console.log(
                chalk.gray(
                    `Podés instalar manualmente con: ${projectName !== "." ? `cd ${projectName} && ` : ""}npm install`
                )
            );
        }
    }

    // Mensaje de éxito
    console.log(
        chalk.green.bold(
            `\n🎉 ¡Proyecto ${projectName === "." ? "en el directorio actual" : `"${projectName}"`} creado exitosamente!\n`
        )
    );

    console.log(chalk.cyan.bold("👉 Próximos pasos:"));
    if (projectName !== ".") {
        console.log(chalk.gray(`   cd ${projectName}`));
    }

    if (!installDependencies) {
        console.log(chalk.gray("   npm install  # o pnpm install"));
    }

    if (allDependencies.length > 0) {
        console.log(
            chalk.yellow(
                `   npm install ${allDependencies.join(" ")}  # dependencias de integraciones`
            )
        );
    }

    console.log(chalk.gray("   npm run dev  # o pnpm dev"));

    if (addedIntegrations.length > 0) {
        console.log(chalk.cyan.bold("\n🔌 Integraciones agregadas:"));
        for (const integration of addedIntegrations) {
            console.log(chalk.gray(`   • ${integration.name} - ${integration.description}`));
        }
        console.log(
            chalk.yellow("\n⚠️ No olvides configurar las variables de entorno en .env.local")
        );
    }

    console.log(chalk.magenta.bold("\n🚀 ¡Gracias por usar Devanthos! 💜"));
    console.log(chalk.gray("   Documentación: https://docs.devanthos.com"));
    console.log(chalk.gray("   Soporte: https://discord.gg/devanthos\n"));
}
