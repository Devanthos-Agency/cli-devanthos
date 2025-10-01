import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import chalk from "chalk";
import https from "https";

/**
 * Sistema de actualizaciones automáticas para Devanthos CLI
 */

const CACHE_DIR = path.join(
    process.env.HOME || process.env.USERPROFILE || "",
    ".devanthos",
    "cache"
);
const UPDATE_CHECK_FILE = path.join(CACHE_DIR, "last-update-check.json");
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Obtener versión actual del package.json
 */
function getCurrentVersion() {
    try {
        const packageJsonPath = new URL("../package.json", import.meta.url).pathname;
        // En Windows, remover la barra inicial si existe
        const cleanPath =
            process.platform === "win32" && packageJsonPath.startsWith("/")
                ? packageJsonPath.substring(1)
                : packageJsonPath;
        const packageJson = JSON.parse(readFileSync(cleanPath, "utf-8"));
        return packageJson.version;
    } catch (error) {
        return "unknown";
    }
}

/**
 * Obtener última versión disponible en npm
 */
function getLatestVersion(packageName = "create-devanthos-app") {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "registry.npmjs.org",
            path: `/${packageName}/latest`,
            method: "GET",
            headers: {
                "User-Agent": "create-devanthos-app"
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
                    reject(new Error("Error parseando respuesta de npm"));
                }
            });
        });

        req.on("error", error => {
            reject(error);
        });

        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Timeout consultando versión"));
        });

        req.end();
    });
}

/**
 * Comparar versiones semánticas
 */
function compareVersions(current, latest) {
    const currentParts = current.split(".").map(Number);
    const latestParts = latest.split(".").map(Number);

    for (let i = 0; i < 3; i++) {
        const curr = currentParts[i] || 0;
        const last = latestParts[i] || 0;

        if (last > curr) return 1; // Hay actualización
        if (last < curr) return -1; // Versión local más nueva
    }

    return 0; // Misma versión
}

/**
 * Verificar si debe chequear actualizaciones (respetar intervalo de caché)
 */
function shouldCheckForUpdates() {
    if (!existsSync(UPDATE_CHECK_FILE)) {
        return true;
    }

    try {
        const lastCheck = JSON.parse(readFileSync(UPDATE_CHECK_FILE, "utf-8"));
        const timeSinceLastCheck = Date.now() - lastCheck.timestamp;
        return timeSinceLastCheck > CHECK_INTERVAL;
    } catch {
        return true;
    }
}

/**
 * Guardar timestamp del último chequeo
 */
function saveUpdateCheck(version) {
    try {
        if (!existsSync(CACHE_DIR)) {
            mkdirSync(CACHE_DIR, { recursive: true });
        }

        const data = {
            timestamp: Date.now(),
            version,
            checked: new Date().toISOString()
        };

        writeFileSync(UPDATE_CHECK_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        // Ignorar errores al guardar caché
    }
}

/**
 * Detectar cómo se instaló el paquete
 */
function detectInstallMethod() {
    // Verificar si está instalado globalmente
    try {
        const globalPath = execSync("npm root -g", {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim();
        const packagePath = path.join(globalPath, "create-devanthos-app");

        if (existsSync(packagePath)) {
            return "global";
        }
    } catch {
        // No está instalado globalmente
    }

    return "npx";
}

/**
 * Mostrar mensaje de actualización disponible
 */
function showUpdateMessage(current, latest, installMethod) {
    console.log(chalk.yellow("\n┌─────────────────────────────────────────────────────┐"));
    console.log(
        `${chalk.yellow("│")}  🎉 Nueva versión disponible de Devanthos CLI  ${chalk.yellow("│")}`
    );
    console.log(chalk.yellow("├─────────────────────────────────────────────────────┤"));
    console.log(
        chalk.yellow("│") + `  Versión actual: ${chalk.red(current)}`.padEnd(52) + chalk.yellow("│")
    );
    console.log(
        chalk.yellow("│") +
            `  Nueva versión:  ${chalk.green(latest)}`.padEnd(52) +
            chalk.yellow("│")
    );
    console.log(chalk.yellow("├─────────────────────────────────────────────────────┤"));

    if (installMethod === "global") {
        console.log(chalk.yellow("│") + "  Actualiza con:".padEnd(52) + chalk.yellow("│"));
        console.log(
            chalk.yellow("│") +
                `  ${chalk.cyan("npm install -g create-devanthos-app@latest")}`.padEnd(62) +
                chalk.yellow("│")
        );
    } else {
        console.log(
            chalk.yellow("│") +
                "  Ejecutá con npx para usar la última versión  ".padEnd(52) +
                chalk.yellow("│")
        );
        console.log(
            chalk.yellow("│") +
                `  ${chalk.cyan("npx create-devanthos-app@latest")}`.padEnd(62) +
                chalk.yellow("│")
        );
    }

    console.log(chalk.yellow("└─────────────────────────────────────────────────────┘\n"));
}

/**
 * Chequear actualizaciones (función principal)
 */
export async function checkForUpdates(options = {}) {
    const { force = false, silent = false } = options;

    // Permitir desactivar el chequeo
    if (process.env.DEVANTHOS_NO_UPDATE_CHECK === "true") {
        return { updateAvailable: false, skipped: true, reason: "disabled" };
    }

    // Si no es forzado y no debe chequear, salir
    if (!force && !shouldCheckForUpdates()) {
        return { updateAvailable: false, skipped: true, reason: "cached" };
    }

    try {
        const currentVersion = getCurrentVersion();

        if (currentVersion === "unknown") {
            return { updateAvailable: false, error: "No se pudo determinar versión actual" };
        }

        const latestVersion = await getLatestVersion();

        if (!latestVersion) {
            return { updateAvailable: false, error: "No se pudo obtener última versión" };
        }

        // Guardar timestamp del chequeo
        saveUpdateCheck(latestVersion);

        const comparison = compareVersions(currentVersion, latestVersion);

        if (comparison === 1) {
            // Hay actualización disponible
            if (!silent) {
                const installMethod = detectInstallMethod();
                showUpdateMessage(currentVersion, latestVersion, installMethod);
            }

            return {
                updateAvailable: true,
                currentVersion,
                latestVersion,
                installMethod: detectInstallMethod()
            };
        }

        return {
            updateAvailable: false,
            currentVersion,
            latestVersion
        };
    } catch (error) {
        // Fallar silenciosamente si hay problemas de red
        if (!silent && process.env.NODE_ENV === "development") {
            console.log(chalk.gray(`⚠️ No se pudo chequear actualizaciones: ${error.message}`));
        }

        return {
            updateAvailable: false,
            error: error.message
        };
    }
}

/**
 * Comando para chequear actualizaciones manualmente
 */
export async function checkUpdateCommand() {
    console.log(chalk.cyan("🔍 Chequeando actualizaciones...\n"));

    const result = await checkForUpdates({ force: true, silent: false });

    if (result.updateAvailable) {
        console.log(chalk.green("\n✅ Actualización disponible (ver arriba)"));
    } else if (result.error) {
        console.log(chalk.yellow(`⚠️ ${result.error}`));
    } else {
        console.log(chalk.green(`✅ Ya estás usando la última versión (${result.currentVersion})`));
    }

    return result;
}

/**
 * Limpiar caché de chequeos
 */
export function clearUpdateCache() {
    try {
        if (existsSync(UPDATE_CHECK_FILE)) {
            require("fs").unlinkSync(UPDATE_CHECK_FILE);
            return true;
        }
    } catch {
        return false;
    }
    return false;
}
