import { execSync, spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";

// Detectar qué gestores de paquetes están disponibles
const detectPackageManager = () => {
    const managers = {
        pnpm: { command: "pnpm", args: ["install"], priority: 1 },
        yarn: { command: "yarn", args: ["install"], priority: 2 },
        bun: { command: "bun", args: ["install"], priority: 3 },
        npm: { command: "npm", args: ["install"], priority: 4 }
    };

    const available = [];

    for (const [name, config] of Object.entries(managers)) {
        try {
            execSync(`${config.command} --version`, {
                stdio: "ignore",
                timeout: 3000
            });
            available.push({ name, ...config });
        } catch {
            // Package manager no disponible
        }
    }

    // Ordenar por prioridad (pnpm preferido)
    return available.sort((a, b) => a.priority - b.priority);
};

// Detectar gestor preferido por el proyecto
const detectProjectPackageManager = projectPath => {
    const lockFiles = {
        "pnpm-lock.yaml": "pnpm",
        "yarn.lock": "yarn",
        "bun.lockb": "bun",
        "package-lock.json": "npm"
    };

    for (const [lockFile, manager] of Object.entries(lockFiles)) {
        if (existsSync(path.join(projectPath, lockFile))) {
            return manager;
        }
    }

    return null;
};

// Ejecutar instalación con un gestor específico
const runInstallation = (manager, projectPath) => {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(manager.command, manager.args, {
            cwd: projectPath,
            stdio: ["ignore", "pipe", "pipe"],
            shell: true
        });

        let stdout = "";
        let stderr = "";

        childProcess.stdout?.on("data", data => {
            stdout += data.toString();
            // Mostrar progreso en tiempo real para comandos largos
            if (data.toString().includes("%") || data.toString().includes("packages")) {
                process.stdout.write(".");
            }
        });

        childProcess.stderr?.on("data", data => {
            stderr += data.toString();
        });

        // Timeout de 5 minutos para instalaciones largas
        const timeoutId = setTimeout(() => {
            childProcess.kill();
            reject({
                success: false,
                manager: manager.name,
                error: "Timeout - La instalación tardó demasiado"
            });
        }, 300000);

        childProcess.on("close", code => {
            clearTimeout(timeoutId);
            if (code === 0) {
                resolve({ success: true, manager: manager.name, stdout });
            } else {
                reject({
                    success: false,
                    manager: manager.name,
                    code,
                    stderr: stderr || stdout
                });
            }
        });

        childProcess.on("error", error => {
            clearTimeout(timeoutId);
            reject({
                success: false,
                manager: manager.name,
                error: error.message
            });
        });
    });
};

// Función principal de instalación con fallbacks inteligentes
export async function installDeps(projectName) {
    const projectPath = path.resolve(process.cwd(), projectName);

    // Verificar que existe package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!existsSync(packageJsonPath)) {
        throw new Error(`❌ No se encontró package.json en ${projectPath}`);
    }

    // Detectar gestores disponibles
    const availableManagers = detectPackageManager();

    if (availableManagers.length === 0) {
        throw new Error(`❌ No se encontró ningún gestor de paquetes instalado.
    
        📦 Instala uno de estos gestores:
        • npm (viene con Node.js)
        • pnpm: ${chalk.cyan("npm install -g pnpm")}
        • yarn: ${chalk.cyan("npm install -g yarn")}
        • bun: ${chalk.cyan("curl -fsSL https://bun.sh/install | bash")}`);
    }

    // Detectar gestor preferido por el proyecto
    const projectManager = detectProjectPackageManager(projectPath);
    let managersToTry = [];

    if (projectManager) {
        // Priorizar el gestor del proyecto si está disponible
        const preferredManager = availableManagers.find(m => m.name === projectManager);
        if (preferredManager) {
            managersToTry = [
                preferredManager,
                ...availableManagers.filter(m => m.name !== projectManager)
            ];
        } else {
            managersToTry = availableManagers;
            console.log(
                chalk.yellow(
                    `⚠️ El proyecto prefiere ${projectManager}, pero no está instalado. Usando ${availableManagers[0].name}.`
                )
            );
        }
    } else {
        managersToTry = availableManagers;
    }

    // Intentar instalación con fallbacks
    let lastError = null;

    for (let i = 0; i < managersToTry.length; i++) {
        const manager = managersToTry[i];

        try {
            console.log(chalk.gray(`   Intentando con ${manager.name}...`));

            const result = await runInstallation(manager, projectPath);

            if (result.success) {
                console.log(chalk.green(`   ✅ Instalación completada con ${manager.name}`));

                // Mostrar estadísticas si están disponibles
                if (result.stdout.includes("packages")) {
                    const packagesMatch = result.stdout.match(/(\d+)\s+packages?/);
                    if (packagesMatch) {
                        console.log(chalk.gray(`   📦 ${packagesMatch[1]} paquetes instalados`));
                    }
                }

                return { manager: manager.name, success: true };
            }
        } catch (error) {
            lastError = error;

            if (i === managersToTry.length - 1) {
                // Es el último intento, mostrar error
                break;
            } else {
                // Hay más gestores para probar
                console.log(chalk.yellow(`   ⚠️ Error con ${manager.name}, probando siguiente...`));
                continue;
            }
        }
    }

    // Si llegamos aquí, todos los gestores fallaron
    console.log(chalk.red("   ❌ No se pudo instalar con ningún gestor disponible"));

    if (lastError) {
        console.log(chalk.gray(`\n🔍 Último error (${lastError.manager}):`));
        console.log(chalk.red(`   ${lastError.stderr || lastError.error || "Error desconocido"}`));
    }

    console.log(chalk.cyan("\n💡 Instalación manual recomendada:"));
    console.log(chalk.gray(`   cd ${projectName}`));
    console.log(chalk.gray(`   ${managersToTry[0].command} install`));

    throw new Error("Fallo en la instalación automática de dependencias");
}

// Función de utilidad para verificar si las dependencias están instaladas
export function verifyInstallation(projectPath) {
    const nodeModulesPath = path.join(projectPath, "node_modules");
    return existsSync(nodeModulesPath);
}

// Función para limpiar caché de gestores (utilidad extra)
export async function clearPackageManagerCache() {
    const commands = ["npm cache clean --force", "pnpm store prune", "yarn cache clean"];

    for (const command of commands) {
        try {
            execSync(command, { stdio: "ignore", timeout: 10000 });
        } catch {
            // Ignorar errores si el gestor no está disponible
        }
    }
}
