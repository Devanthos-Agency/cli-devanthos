import { existsSync, mkdirSync, rmSync, readdirSync, statSync, copyFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

// Obtener la ruta del CLI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.resolve(__dirname, "..");

// Configuración de plantillas locales
const TEMPLATES = {
    astro: {
        templatePath: path.join(CLI_ROOT, "templates", "astro-template-devanthos", "www"),
        extrasPath: path.join(CLI_ROOT, "templates", "astro-template-devanthos", "extras"),
        description:
            "Plantilla moderna de Astro con TypeScript, Tailwind CSS y componentes optimizados"
    },
    next: {
        templatePath: path.join(CLI_ROOT, "templates", "next-template-devanthos", "www"),
        extrasPath: path.join(CLI_ROOT, "templates", "next-template-devanthos", "extras"),
        description:
            "Plantilla de Next.js con App Router, TypeScript, Tailwind CSS y mejores prácticas"
    },
    expo: {
        templatePath: path.join(CLI_ROOT, "templates", "expo-template-devanthos", "www"),
        extrasPath: path.join(CLI_ROOT, "templates", "expo-template-devanthos", "extras"),
        description:
            "Plantilla de Expo con React Native, TypeScript, NativeWind y navegación configurada"
    }
};

// Validar si el directorio existe y no está vacío
const validateDirectory = projectName => {
    const projectPath = path.resolve(process.cwd(), projectName);

    if (existsSync(projectPath)) {
        const files = readdirSync(projectPath);
        if (files.length > 0) {
            throw new Error(`❌ El directorio "${projectName}" ya existe y no está vacío.
                
            💡 Opciones:
            • Usa un nombre diferente
            • Elimina el directorio existente
            • Ejecuta: ${chalk.cyan(`rm -rf ${projectName}`)}`);
        }
    }

    return projectPath;
};

// Limpiar directorio en caso de error
const cleanupOnError = projectPath => {
    try {
        if (existsSync(projectPath)) {
            rmSync(projectPath, { recursive: true, force: true });
        }
    } catch (cleanupError) {
        console.warn(chalk.yellow(`⚠️ No se pudo limpiar el directorio: ${cleanupError.message}`));
    }
};

// Función principal de copia de plantilla local
export async function cloneTemplate(framework, projectName) {
    if (!TEMPLATES[framework]) {
        throw new Error(`❌ Framework "${framework}" no soportado.
    
        🔧 Frameworks disponibles: ${Object.keys(TEMPLATES).join(", ")}`);
    }

    const template = TEMPLATES[framework];
    const projectPath = validateDirectory(projectName);

    // Verificar que la plantilla local existe
    if (!existsSync(template.templatePath)) {
        throw new Error(`❌ La plantilla local no existe en: ${template.templatePath}
        
        🔍 Verifica que el CLI esté instalado correctamente con todas las plantillas.`);
    }

    try {
        // Crear directorio del proyecto
        if (!existsSync(projectPath)) {
            mkdirSync(projectPath, { recursive: true });
        }

        // Copiar la plantilla desde templates/{framework}/www
        copyRecursiveSync(template.templatePath, projectPath);

        // Verificar que la copia fue exitosa
        if (!existsSync(path.join(projectPath, "package.json"))) {
            throw new Error(`❌ La plantilla copiada no parece ser válida (falta package.json).
                
            🔍 Verifica la estructura de la plantilla en: ${template.templatePath}`);
        }

        return {
            success: true,
            path: projectPath,
            template: template.description,
            extrasPath: template.extrasPath
        };
    } catch (error) {
        // Limpiar en caso de error
        cleanupOnError(projectPath);

        // Mejorar mensaje de error según el tipo
        if (error.message.includes("EACCES") || error.message.includes("permission")) {
            throw new Error(`❌ Error de permisos al crear el directorio.
                
            💡 Soluciones:
            • Ejecuta el comando como administrador
            • Verifica permisos del directorio actual
            • Cambia a un directorio con permisos de escritura`);
        }

        if (error.message.includes("ENOSPC")) {
            throw new Error(`❌ No hay suficiente espacio en disco.
            
            💾 Libera espacio y vuelve a intentar.`);
        }

        // Error genérico mejorado
        throw new Error(`❌ Error al copiar la plantilla: ${error.message}
    
        🆘 Si el problema persiste, reporta el issue en:
        https://github.com/devanthos/create-devanthos-app/issues`);
    }
}

// Función auxiliar para copiar recursivamente
function copyRecursiveSync(src, dest) {
    const exists = existsSync(src);
    const stats = exists && statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
        }
        readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        copyFileSync(src, dest);
    }
}

// Función para listar plantillas disponibles (utilidad extra)
export function getAvailableTemplates() {
    return Object.entries(TEMPLATES).map(([key, template]) => ({
        framework: key,
        templatePath: template.templatePath,
        extrasPath: template.extrasPath,
        description: template.description,
        available: existsSync(template.templatePath)
    }));
}
