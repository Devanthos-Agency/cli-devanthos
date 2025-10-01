import degit from "degit";
import { existsSync, mkdirSync, rmSync } from "fs";
import path from "path";
import chalk from "chalk";

// Configuración de plantillas (actualizar con tus repositorios reales)
const TEMPLATES = {
    astro: {
        repo: "devanthos/astro-template-devanthos",
        description:
            "Plantilla moderna de Astro con TypeScript, Tailwind CSS y componentes optimizados"
    },
    next: {
        repo: "devanthos/next-template-devanthos",
        description:
            "Plantilla de Next.js con App Router, TypeScript, Tailwind CSS y mejores prácticas"
    },
    expo: {
        repo: "devanthos/expo-template-devanthos",
        description:
            "Plantilla de Expo con React Native, TypeScript, NativeWind y navegación configurada"
    }
};

// Validar si el directorio existe y no está vacío
const validateDirectory = projectName => {
    const projectPath = path.resolve(process.cwd(), projectName);

    if (existsSync(projectPath)) {
        const files = require("fs").readdirSync(projectPath);
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

// Función principal de clonado
export async function cloneTemplate(framework, projectName) {
    if (!TEMPLATES[framework]) {
        throw new Error(`❌ Framework "${framework}" no soportado.
    
        🔧 Frameworks disponibles: ${Object.keys(TEMPLATES).join(", ")}`);
    }

    const template = TEMPLATES[framework];
    const projectPath = validateDirectory(projectName);

    try {
        // Crear directorio del proyecto
        if (!existsSync(projectPath)) {
            mkdirSync(projectPath, { recursive: true });
        }

        // Configurar degit con opciones mejoradas
        const emitter = degit(template.repo, {
            cache: false,
            force: true,
            verbose: process.env.NODE_ENV === "development"
        });

        // Event listeners para degit (opcional, para debugging)
        emitter.on("info", info => {
            if (process.env.NODE_ENV === "development") {
                console.log(chalk.gray(`ℹ️ ${info.message}`));
            }
        });

        emitter.on("warn", warning => {
            console.warn(chalk.yellow(`⚠️ ${warning.message}`));
        });

        // Clonar el repositorio
        await emitter.clone(projectPath);

        // Verificar que la clonación fue exitosa
        if (!existsSync(path.join(projectPath, "package.json"))) {
            throw new Error(`❌ La plantilla clonada no parece ser válida (falta package.json).
                
🔍          Verifica que el repositorio ${template.repo} existe y es accesible.`);
        }

        return {
            success: true,
            path: projectPath,
            template: template.description
        };
    } catch (error) {
        // Limpiar en caso de error
        cleanupOnError(projectPath);

        // Mejorar mensaje de error según el tipo
        if (error.message.includes("not found")) {
            throw new Error(`❌ No se encontró la plantilla "${template.repo}".
                
            🔍 Verifica que:
            • El repositorio existe en GitHub
            • Tienes acceso de lectura
            • Tu conexión a internet funciona`);
        }

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
        throw new Error(`❌ Error al clonar la plantilla: ${error.message}
    
        🆘 Si el problema persiste, reporta el issue en:
        https://github.com/devanthos/create-devanthos-app/issues`);
    }
}

// Función para listar plantillas disponibles (utilidad extra)
export function getAvailableTemplates() {
    return Object.entries(TEMPLATES).map(([key, template]) => ({
        framework: key,
        repo: template.repo,
        description: template.description
    }));
}
