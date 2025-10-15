/**
 * @devanthos/plugin-database
 *
 * Plugin para integración de base de datos (Prisma, Drizzle, MongoDB)
 */

export default {
    name: "@devanthos/plugin-database",
    version: "1.0.0",
    description: "Agrega configuración de base de datos con Prisma",

    async afterClone({ _projectName, framework }) {
        console.log(`💾 [Database Plugin] Configurando base de datos para ${framework}...`);
    },

    dependencies: {
        next: ["prisma", "@prisma/client"],
        astro: ["@prisma/client"]
    },

    devDependencies: {
        next: ["prisma"],
        astro: ["prisma"]
    },

    files: {
        next: [
            {
                path: "prisma/schema.prisma",
                content: `// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`
            },
            {
                path: "lib/prisma.ts",
                content: `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
`
            }
        ]
    },

    postInstall: {
        message: "💾 Prisma configurado. Ejecuta los siguientes comandos:",
        instructions: [
            "1. Configura DATABASE_URL en .env",
            "2. Ejecuta: npx prisma generate",
            "3. Ejecuta: npx prisma db push",
            "4. (Opcional) Ejecuta: npx prisma studio"
        ],
        envVars: ["DATABASE_URL"]
    }
};
