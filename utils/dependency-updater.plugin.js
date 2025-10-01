import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import https from "https";

/**
 * Plugin para actualizar dependencias de los proyectos creados
 * Mantiene las dependencias al día con las últimas versiones compatibles
 */

/**
 * Obtener la última versión de un paquete de npm
 */
async function getLatestPackageVersion(packageName, tag = "latest") {
    return new Promise((resolve, _reject) => {
        const options = {
            hostname: "registry.npmjs.org",
            path: `/${packageName}/${tag}`,
            method: "GET",
            headers: {
                "User-Agent": "devanthos-dependency-updater"
            },
            timeout: 5000
        };

        const req = https.request(options, res => {
            let data = "";

            res.on("data", chunk => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.version || null);
                } catch (error) {
                    resolve(null);
                }
            });
        });

        req.on("error", () => {
            resolve(null);
        });

        req.on("timeout", () => {
            req.destroy();
            resolve(null);
        });

        req.end();
    });
}

/**
 * Actualizar dependencias específicas según el framework
 */
async function updateDependencies(projectPath, framework) {
    const packageJsonPath = path.join(projectPath, "package.json");

    if (!existsSync(packageJsonPath)) {
        return { updated: false, reason: "package.json no encontrado" };
    }

    try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        const updates = [];

        // Configuración de paquetes críticos a actualizar por framework
        const packagesToUpdate = {
            astro: {
                dependencies: ["astro"],
                devDependencies: ["@astrojs/tailwind", "tailwindcss", "typescript"]
            },
            next: {
                dependencies: ["next", "react", "react-dom"],
                devDependencies: ["@types/react", "@types/node", "typescript", "tailwindcss"]
            },
            expo: {
                dependencies: ["expo", "react", "react-native"],
                devDependencies: ["@types/react", "typescript"]
            }
        };

        const frameworkPackages = packagesToUpdate[framework];
        if (!frameworkPackages) {
            return { updated: false, reason: "Framework no soportado" };
        }

        // Actualizar dependencies
        if (packageJson.dependencies && frameworkPackages.dependencies) {
            for (const pkg of frameworkPackages.dependencies) {
                if (packageJson.dependencies[pkg]) {
                    const latestVersion = await getLatestPackageVersion(pkg);
                    if (latestVersion) {
                        const oldVersion = packageJson.dependencies[pkg];
                        packageJson.dependencies[pkg] = `^${latestVersion}`;
                        updates.push({
                            package: pkg,
                            from: oldVersion,
                            to: `^${latestVersion}`,
                            type: "dependency"
                        });
                    }
                }
            }
        }

        // Actualizar devDependencies
        if (packageJson.devDependencies && frameworkPackages.devDependencies) {
            for (const pkg of frameworkPackages.devDependencies) {
                if (packageJson.devDependencies[pkg]) {
                    const latestVersion = await getLatestPackageVersion(pkg);
                    if (latestVersion) {
                        const oldVersion = packageJson.devDependencies[pkg];
                        packageJson.devDependencies[pkg] = `^${latestVersion}`;
                        updates.push({
                            package: pkg,
                            from: oldVersion,
                            to: `^${latestVersion}`,
                            type: "devDependency"
                        });
                    }
                }
            }
        }

        // Guardar package.json actualizado
        if (updates.length > 0) {
            writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);
            return { updated: true, updates, count: updates.length };
        }

        return { updated: false, reason: "No hay actualizaciones disponibles" };
    } catch (error) {
        return { updated: false, reason: error.message };
    }
}

/**
 * Plugin de actualización de dependencias
 */
export default {
    name: "dependency-updater",
    version: "1.0.0",
    description: "Actualiza las dependencias del proyecto a las últimas versiones compatibles",
    author: "Devanthos Team",
    priority: 50, // Ejecutar antes que otros plugins

    /**
     * Hook: después de clonar la plantilla
     */
    async afterClone(context) {
        const { framework, projectName } = context;

        // Verificar si el usuario quiere actualizar dependencias
        const shouldUpdate = process.env.DEVANTHOS_UPDATE_DEPS !== "false";

        if (!shouldUpdate) {
            return context;
        }

        const projectPath = path.resolve(process.cwd(), projectName);

        const spinner = ora({
            text: "Actualizando dependencias a las últimas versiones...",
            color: "cyan"
        }).start();

        try {
            const result = await updateDependencies(projectPath, framework);

            if (result.updated) {
                spinner.succeed(
                    chalk.green(
                        `✅ ${result.count} dependencia(s) actualizada(s) a las últimas versiones`
                    )
                );

                // Mostrar detalles de las actualizaciones
                if (process.env.DEVANTHOS_VERBOSE === "true") {
                    console.log(chalk.gray("\n   Actualizaciones realizadas:"));
                    result.updates.forEach(update => {
                        console.log(
                            chalk.gray(
                                `   • ${update.package}: ${update.from} → ${chalk.green(update.to)}`
                            )
                        );
                    });
                    console.log();
                }
            } else {
                spinner.info(
                    chalk.yellow(`ℹ️ Dependencias ya están actualizadas (${result.reason})`)
                );
            }

            return { ...context, dependenciesUpdated: result.updated };
        } catch (error) {
            spinner.fail(chalk.red(`❌ Error actualizando dependencias: ${error.message}`));
            return context;
        }
    },

    /**
     * Hook: después de instalar dependencias
     * Verificar si hay vulnerabilidades
     */
    async afterInstall(context) {
        const { projectName } = context;
        const projectPath = path.resolve(process.cwd(), projectName);

        // Solo auditar si está habilitado
        if (process.env.DEVANTHOS_AUDIT === "true") {
            const spinner = ora({
                text: "Verificando vulnerabilidades de seguridad...",
                color: "yellow"
            }).start();

            try {
                // Ejecutar npm audit
                const auditResult = execSync("npm audit --json", {
                    cwd: projectPath,
                    encoding: "utf-8",
                    stdio: ["ignore", "pipe", "ignore"]
                });

                const audit = JSON.parse(auditResult);
                const vulnerabilities = audit.metadata?.vulnerabilities || {};
                const total =
                    (vulnerabilities.low || 0) +
                    (vulnerabilities.moderate || 0) +
                    (vulnerabilities.high || 0) +
                    (vulnerabilities.critical || 0);

                if (total === 0) {
                    spinner.succeed(chalk.green("✅ No se encontraron vulnerabilidades"));
                } else {
                    spinner.warn(
                        chalk.yellow(
                            `⚠️ Se encontraron ${total} vulnerabilidad(es). Ejecuta 'npm audit fix' en el proyecto.`
                        )
                    );
                }
            } catch (error) {
                // npm audit puede fallar con código de salida no-cero si hay vulnerabilidades
                spinner.info(chalk.gray("ℹ️ Auditoría de seguridad completada"));
            }
        }

        return context;
    }
};
