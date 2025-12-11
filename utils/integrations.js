import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

// Obtener la ruta del CLI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.resolve(__dirname, "..");

// Definición de integraciones disponibles
export const INTEGRATIONS = {
    mercadopago: {
        id: "mercadopago",
        name: "💳 Mercado Pago",
        description: "Pagos con Mercado Pago",
        frameworks: ["next"], // Solo disponible para Next.js por ahora
        dependencies: ["mercadopago"],
        envVars: [
            "MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui",
            "MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui",
            "NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui"
        ],
        files: [
            { from: "lib/mercadopago.ts", to: "src/lib/mercadopago.ts" },
            {
                from: "app/api/mercadopago/create-preference/route.ts",
                to: "src/app/api/mercadopago/create-preference/route.ts"
            },
            {
                from: "app/api/mercadopago/webhook/route.ts",
                to: "src/app/api/mercadopago/webhook/route.ts"
            },
            { from: "components/checkout-button.tsx", to: "src/components/checkout-button.tsx" }
        ]
    },
    auth: {
        id: "auth",
        name: "🔐 NextAuth.js",
        description: "Autenticación con NextAuth.js v5",
        frameworks: ["next"],
        dependencies: ["next-auth@beta"],
        envVars: [
            "AUTH_SECRET=tu_secreto_aqui",
            "NEXTAUTH_URL=http://localhost:3000",
            "AUTH_GOOGLE_ID=tu_google_client_id",
            "AUTH_GOOGLE_SECRET=tu_google_client_secret",
            "AUTH_GITHUB_ID=tu_github_client_id",
            "AUTH_GITHUB_SECRET=tu_github_client_secret"
        ],
        files: [
            { from: "auth.ts", to: "src/auth.ts" },
            { from: "middleware.ts", to: "src/middleware.ts" },
            {
                from: "app/api/auth/[...nextauth]/route.ts",
                to: "src/app/api/auth/[...nextauth]/route.ts"
            },
            {
                from: "components/auth/auth-buttons.tsx",
                to: "src/components/auth/auth-buttons.tsx"
            },
            {
                from: "components/auth/session-provider.tsx",
                to: "src/components/auth/session-provider.tsx"
            },
            { from: "components/auth/login-form.tsx", to: "src/components/auth/login-form.tsx" }
        ]
    },
    mongodb: {
        id: "mongodb",
        name: "🍃 MongoDB",
        description: "Base de datos MongoDB",
        frameworks: ["next"],
        dependencies: ["mongodb"],
        envVars: [
            "MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tu-base-datos",
            "MONGODB_DB=mi-base-datos"
        ],
        files: [
            { from: "lib/mongodb.ts", to: "src/lib/mongodb.ts" },
            { from: "lib/models/user.ts", to: "src/lib/models/user.ts" },
            { from: "app/api/health/route.ts", to: "src/app/api/health/route.ts" },
            { from: "app/api/users/route.ts", to: "src/app/api/users/route.ts" }
        ]
    }
};

// Aliases para las integraciones (shortcuts)
export const INTEGRATION_ALIASES = {
    mp: "mercadopago",
    mercado: "mercadopago",
    pago: "mercadopago",
    pagos: "mercadopago",
    authentication: "auth",
    nextauth: "auth",
    login: "auth",
    mongo: "mongodb",
    db: "mongodb",
    database: "mongodb"
};

/**
 * Resolver alias de integración
 */
export function resolveIntegrationAlias(input) {
    const normalized = input.toLowerCase().trim();
    return INTEGRATION_ALIASES[normalized] || normalized;
}

/**
 * Parsear lista de integraciones desde string
 * Soporta: "mercadopago,auth" o "mercadopago auth" o "mp,auth"
 */
export function parseIntegrations(input) {
    if (!input) return [];

    // Separar por coma o espacio
    const items = input.split(/[,\s]+/).filter(Boolean);

    // Resolver aliases y filtrar duplicados
    const resolved = [...new Set(items.map(resolveIntegrationAlias))];

    return resolved;
}

/**
 * Validar integraciones para un framework específico
 */
export function validateIntegrations(integrationIds, framework) {
    const errors = [];
    const valid = [];

    for (const id of integrationIds) {
        const integration = INTEGRATIONS[id];

        if (!integration) {
            errors.push({
                id,
                error: `Integración "${id}" no encontrada`
            });
            continue;
        }

        if (!integration.frameworks.includes(framework)) {
            errors.push({
                id,
                error: `"${integration.name}" no está disponible para ${framework}. Solo para: ${integration.frameworks.join(", ")}`
            });
            continue;
        }

        valid.push(integration);
    }

    return { valid, errors };
}

/**
 * Obtener ruta de la integración
 */
function getIntegrationPath(framework, integrationId) {
    return path.join(
        CLI_ROOT,
        "templates",
        `${framework}-template-devanthos`,
        "extras",
        "integrations",
        integrationId
    );
}

/**
 * Copiar archivos de integración al proyecto
 */
export async function copyIntegration(framework, integrationId, projectPath) {
    const integration = INTEGRATIONS[integrationId];
    if (!integration) {
        throw new Error(`Integración "${integrationId}" no encontrada`);
    }

    const integrationPath = getIntegrationPath(framework, integrationId);

    if (!existsSync(integrationPath)) {
        throw new Error(`Archivos de integración no encontrados en: ${integrationPath}`);
    }

    const copiedFiles = [];

    for (const file of integration.files) {
        const sourcePath = path.join(integrationPath, file.from);
        const destPath = path.join(projectPath, file.to);

        if (!existsSync(sourcePath)) {
            console.warn(chalk.yellow(`  ⚠️ Archivo no encontrado: ${file.from}`));
            continue;
        }

        // Crear directorio destino si no existe
        const destDir = path.dirname(destPath);
        if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
        }

        // Copiar archivo
        copyFileSync(sourcePath, destPath);
        copiedFiles.push(file.to);
    }

    return {
        integration,
        copiedFiles,
        dependencies: integration.dependencies,
        envVars: integration.envVars
    };
}

/**
 * Agregar variables de entorno al archivo .env.local
 */
export function appendEnvVars(projectPath, envVars) {
    const envPath = path.join(projectPath, ".env.local");

    let content = "";
    if (existsSync(envPath)) {
        content = readFileSync(envPath, "utf-8");
    }

    // Agregar separador si ya hay contenido
    if (content && !content.endsWith("\n")) {
        content += "\n";
    }

    // Filtrar variables que ya existen
    const existingVars = content
        .split("\n")
        .filter(line => line.includes("="))
        .map(line => line.split("=")[0]);

    const newVars = envVars.filter(envVar => {
        const varName = envVar.split("=")[0];
        return !existingVars.includes(varName);
    });

    if (newVars.length > 0) {
        content += "\n# Agregado por Devanthos CLI\n";
        content += `${newVars.join("\n")}\n`;
        writeFileSync(envPath, content);
    }

    return newVars;
}

/**
 * Listar integraciones disponibles
 */
export function listIntegrations(framework = null) {
    return Object.values(INTEGRATIONS)
        .filter(i => !framework || i.frameworks.includes(framework))
        .map(i => ({
            id: i.id,
            name: i.name,
            description: i.description,
            frameworks: i.frameworks,
            dependencies: i.dependencies
        }));
}

/**
 * Obtener integraciones disponibles para un framework
 */
export function getAvailableIntegrations(framework) {
    return Object.values(INTEGRATIONS).filter(i => i.frameworks.includes(framework));
}

/**
 * Verificar si hay integraciones disponibles para un framework
 */
export function hasIntegrationsForFramework(framework) {
    return Object.values(INTEGRATIONS).some(i => i.frameworks.includes(framework));
}
