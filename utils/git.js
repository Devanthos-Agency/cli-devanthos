import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Inicializa un repositorio Git en el proyecto
 * @param {string} projectPath - Ruta absoluta o relativa del proyecto
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.initialCommit - Crear commit inicial (default: true)
 * @param {string} options.branch - Nombre del branch principal (default: 'main')
 * @param {boolean} options.verbose - Mostrar logs detallados (default: false)
 * @returns {Promise<Object>} Resultado de la inicialización
 */
export async function initGitRepo(projectPath, options = {}) {
    const { initialCommit = true, branch = "main", verbose = false } = options;

    try {
        // Resolver ruta absoluta
        const cwd = path.resolve(projectPath);

        // Verificar que el directorio existe
        if (!existsSync(cwd)) {
            throw new Error(`El directorio ${projectPath} no existe`);
        }

        // Verificar si Git ya está inicializado
        const gitDir = path.join(cwd, ".git");
        if (existsSync(gitDir)) {
            if (verbose) {
                console.log(chalk.gray("ℹ️  Git ya está inicializado"));
            }
            return {
                success: true,
                alreadyInitialized: true,
                message: "Git ya estaba inicializado"
            };
        }

        // Verificar si git está instalado
        try {
            execSync("git --version", { stdio: "ignore" });
        } catch (error) {
            throw new Error("Git no está instalado. Instalá Git desde https://git-scm.com/");
        }

        // Inicializar repositorio
        execSync("git init", { cwd, stdio: verbose ? "inherit" : "ignore" });

        // Crear y cambiar al branch principal
        try {
            execSync(`git checkout -b ${branch}`, {
                cwd,
                stdio: verbose ? "inherit" : "ignore"
            });
        } catch (error) {
            // Si falla, probablemente por versión antigua de git
            execSync(`git branch -M ${branch}`, {
                cwd,
                stdio: verbose ? "inherit" : "ignore"
            });
        }

        // Crear commit inicial si se solicita
        if (initialCommit) {
            // Agregar todos los archivos
            execSync("git add -A", {
                cwd,
                stdio: verbose ? "inherit" : "ignore"
            });

            // Verificar que hay archivos para commitear
            const status = execSync("git status --porcelain", {
                cwd,
                encoding: "utf-8"
            });

            if (status.trim()) {
                execSync("git commit -m \"🎉 Initial commit from create-devanthos-app\"", {
                    cwd,
                    stdio: verbose ? "inherit" : "ignore"
                });

                if (verbose) {
                    console.log(chalk.green("✅ Repositorio Git inicializado"));
                    console.log(chalk.gray(`   Branch: ${branch}`));
                    console.log(chalk.gray("   Commit inicial creado"));
                }
            }
        }

        return {
            success: true,
            alreadyInitialized: false,
            branch,
            commitCreated: initialCommit,
            message: "Git inicializado correctamente"
        };
    } catch (error) {
        // Manejar errores comunes
        let friendlyMessage = error.message;

        if (error.message.includes("not found") || error.message.includes("no se reconoce")) {
            friendlyMessage =
                "Git no está instalado o no está en el PATH. Instalá Git desde https://git-scm.com/";
        } else if (error.message.includes("permission") || error.message.includes("EACCES")) {
            friendlyMessage = `No hay permisos suficientes para inicializar Git en ${projectPath}`;
        }

        if (verbose) {
            console.warn(chalk.yellow(`⚠️  No se pudo inicializar Git: ${friendlyMessage}`));
        }

        return {
            success: false,
            error: friendlyMessage,
            originalError: error.message
        };
    }
}

/**
 * Verifica si Git está instalado en el sistema
 * @returns {boolean} true si Git está disponible
 */
export function isGitInstalled() {
    try {
        execSync("git --version", { stdio: "ignore" });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Verifica si un directorio es un repositorio Git
 * @param {string} projectPath - Ruta del proyecto
 * @returns {boolean} true si es un repositorio Git
 */
export function isGitRepository(projectPath) {
    const gitDir = path.join(path.resolve(projectPath), ".git");
    return existsSync(gitDir);
}

/**
 * Obtiene la configuración de Git del usuario
 * @returns {Object} Configuración del usuario (name, email)
 */
export function getGitConfig() {
    try {
        const name = execSync("git config user.name", {
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();

        const email = execSync("git config user.email", {
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "ignore"]
        }).trim();

        return { name, email, configured: !!(name && email) };
    } catch (error) {
        return { name: null, email: null, configured: false };
    }
}
