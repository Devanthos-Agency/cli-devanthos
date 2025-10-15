# 💾 Plugin Database - Devanthos

Integración completa de base de datos con Prisma ORM para Next.js y Astro.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Modelos](#modelos)
- [Queries](#queries)
- [Migraciones](#migraciones)
- [Prisma Studio](#prisma-studio)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Prisma ORM**: ORM moderno y type-safe
- ✅ **Multi-database**: PostgreSQL, MySQL, SQLite, MongoDB
- ✅ **TypeScript**: Tipos generados automáticamente
- ✅ **Migrations**: Sistema de migraciones robusto
- ✅ **Prisma Studio**: GUI para explorar datos
- ✅ **Connection Pooling**: Optimización automática
- ✅ **Multi-framework**: Next.js y Astro

---

## 📦 Instalación

```bash
npm install @prisma/client
npm install -D prisma
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env`:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# MySQL
# DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite
# DATABASE_URL="file:./dev.db"

# MongoDB
# DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/mydb"
```

### 2. Configurar Prisma

El schema ya está incluido en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql" // Cambia según tu BD
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 3. Inicializar Base de Datos

```bash
# Genera el cliente de Prisma
npx prisma generate

# Crea las tablas en la base de datos
npx prisma db push

# O usa migraciones (recomendado en producción)
npx prisma migrate dev --name init
```

---

## 🚀 Uso

### Importar Prisma Client

```typescript
import { prisma } from "@/lib/prisma";

// El cliente ya está configurado y listo para usar
```

### Next.js - API Route

```typescript
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const data = await request.json();
    const user = await prisma.user.create({ data });
    return NextResponse.json(user);
}
```

### Next.js - Server Component

```typescript
// app/users/page.tsx
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Usuarios</h1>
      {users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

### Astro - API Endpoint

```typescript
// src/pages/api/users.ts
import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const GET: APIRoute = async () => {
    const users = await prisma.user.findMany();

    return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" }
    });
};
```

---

## 📊 Modelos

### Modelo Base (Incluido)

```prisma
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
```

### Agregar Más Modelos

```prisma
model Category {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

model Post {
  // ... campos existentes
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])
}
```

Después de modificar el schema:

```bash
npx prisma generate
npx prisma db push
```

---

## 🔍 Queries

### Create

```typescript
// Crear un usuario
const user = await prisma.user.create({
    data: {
        email: "user@example.com",
        name: "John Doe",
        password: "hashedpassword"
    }
});

// Crear con relaciones
const post = await prisma.post.create({
    data: {
        title: "Mi Post",
        content: "Contenido...",
        author: {
            connect: { id: userId }
        }
    }
});
```

### Read

```typescript
// Buscar uno
const user = await prisma.user.findUnique({
    where: { email: "user@example.com" }
});

// Buscar muchos
const users = await prisma.user.findMany({
    where: {
        email: {
            contains: "@example.com"
        }
    },
    orderBy: {
        createdAt: "desc"
    },
    take: 10
});

// Con relaciones
const userWithPosts = await prisma.user.findUnique({
    where: { id: userId },
    include: {
        posts: true
    }
});
```

### Update

```typescript
// Actualizar uno
const user = await prisma.user.update({
    where: { id: userId },
    data: {
        name: "Nuevo Nombre"
    }
});

// Actualizar muchos
const result = await prisma.user.updateMany({
    where: {
        email: {
            endsWith: "@old-domain.com"
        }
    },
    data: {
        email: "migrated@new-domain.com"
    }
});
```

### Delete

```typescript
// Eliminar uno
await prisma.user.delete({
    where: { id: userId }
});

// Eliminar muchos
await prisma.post.deleteMany({
    where: {
        published: false,
        createdAt: {
            lt: new Date("2023-01-01")
        }
    }
});
```

---

## 🔄 Migraciones

### Desarrollo

```bash
# Crear migración
npx prisma migrate dev --name add_user_role

# Aplicar migraciones pendientes
npx prisma migrate dev
```

### Producción

```bash
# Aplicar migraciones en producción
npx prisma migrate deploy

# Reset completo (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset
```

### Ver Estado

```bash
# Ver estado de migraciones
npx prisma migrate status
```

---

## 🎨 Prisma Studio

GUI visual para explorar y editar datos:

```bash
npx prisma studio
```

Se abre en `http://localhost:5555`

Características:

- 📊 Ver todos los registros
- ✏️ Editar datos en tiempo real
- 🔍 Buscar y filtrar
- 🗑️ Eliminar registros
- ➕ Crear nuevos registros

---

## 📊 Best Practices

### 1. Connection Pooling

Ya implementado en `lib/prisma.ts`:

```typescript
// Reutiliza la instancia en desarrollo
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
```

### 2. Manejo de Errores

```typescript
try {
    const user = await prisma.user.create({ data });
} catch (error) {
    if (error.code === "P2002") {
        // Violación de constraint único
        console.error("Email ya existe");
    } else {
        console.error("Error al crear usuario:", error);
    }
}
```

### 3. Transacciones

```typescript
// Operaciones atómicas
const result = await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.post.create({ data: postData })
]);

// Transacción interactiva
await prisma.$transaction(async tx => {
    const user = await tx.user.create({ data: userData });
    await tx.post.create({
        data: {
            ...postData,
            authorId: user.id
        }
    });
});
```

### 4. Índices para Performance

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String

  @@index([email]) // Índice para búsquedas rápidas
}

model Post {
  id        String   @id @default(cuid())
  title     String
  authorId  String
  createdAt DateTime @default(now())

  @@index([authorId])
  @@index([createdAt])
}
```

---

## 🔧 Troubleshooting

### Error: DATABASE_URL not found

```env
# Asegúrate de tener esto en .env
DATABASE_URL="postgresql://..."
```

### Error: Connection timeout

```env
# Agrega timeout a la URL
DATABASE_URL="postgresql://...?connect_timeout=30"
```

### Error: Table doesn't exist

```bash
# Regenera y pushea el schema
npx prisma generate
npx prisma db push
```

### Prisma Client desactualizado

```bash
# Regenera el cliente después de cambios
npx prisma generate
```

---

## 🎯 Ejemplos Avanzados

### Paginación

```typescript
async function getPaginatedPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        }),
        prisma.post.count()
    ]);

    return {
        posts,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    };
}
```

### Búsqueda Full-Text

```prisma
// PostgreSQL
model Post {
  // ... otros campos

  @@index([title, content], type: FullText)
}
```

```typescript
const results = await prisma.post.findMany({
    where: {
        OR: [{ title: { search: "javascript" } }, { content: { search: "javascript" } }]
    }
});
```

### Agregaciones

```typescript
// Contar posts por usuario
const stats = await prisma.user.findMany({
    select: {
        name: true,
        _count: {
            select: { posts: true }
        }
    }
});

// Promedio, suma, etc.
const aggregation = await prisma.post.aggregate({
    _count: true,
    _avg: { viewCount: true },
    _sum: { viewCount: true },
    _max: { createdAt: true }
});
```

---

## 📚 Recursos

### Documentación Oficial

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### Bases de Datos Soportadas

- PostgreSQL
- MySQL
- SQLite
- MongoDB
- CockroachDB
- Microsoft SQL Server

### Herramientas

- [Prisma Studio](https://www.prisma.io/studio)
- [Prisma Migrate](https://www.prisma.io/migrate)
- [Prisma Data Platform](https://www.prisma.io/dataplatform)

---

**Versión:** 1.0.0  
**Licencia:** MIT  
**Autor:** Devanthos
