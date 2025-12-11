# 🍃 Integración con MongoDB

Esta integración te permite conectar tu proyecto Next.js con MongoDB usando el driver oficial.

## Instalación

```bash
npm install mongodb
# o
pnpm add mongodb
```

## Configuración

### 1. Variables de entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# URI de conexión a MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tu-base-datos?retryWrites=true&w=majority

# Nombre de la base de datos (opcional, se puede especificar en el código)
MONGODB_DB=mi-base-datos
```

> 💡 Puedes obtener una base de datos gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 2. Copiar archivos

Copia los archivos de esta carpeta a tu proyecto:

- `lib/mongodb.ts` → `src/lib/mongodb.ts`
- `lib/models/` → `src/lib/models/` (opcional)
- `app/api/example/` → `src/app/api/example/` (ejemplo de uso)

## Uso

### Conexión básica

```typescript
import clientPromise from "@/lib/mongodb";

async function getData() {
    const client = await clientPromise;
    const db = client.db("mi-base-datos");

    const datos = await db.collection("usuarios").find({}).toArray();
    return datos;
}
```

### En API Routes

```typescript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db();

    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json(users);
}
```

### En Server Components

```typescript
import clientPromise from "@/lib/mongodb";

export default async function UsersPage() {
  const client = await clientPromise;
  const db = client.db();

  const users = await db.collection("users").find({}).toArray();

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id.toString()}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Con modelos tipados

```typescript
import { getCollection, type User } from "@/lib/models/user";

async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    const collection = await getCollection();

    const result = await collection.insertOne({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return result.insertedId;
}
```

## Patrones comunes

### CRUD básico

```typescript
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const client = await clientPromise;
const db = client.db();
const collection = db.collection("items");

// Crear
await collection.insertOne({ name: "Item 1", price: 100 });

// Leer
const item = await collection.findOne({ _id: new ObjectId("...") });
const items = await collection.find({ price: { $gt: 50 } }).toArray();

// Actualizar
await collection.updateOne({ _id: new ObjectId("...") }, { $set: { name: "Nuevo nombre" } });

// Eliminar
await collection.deleteOne({ _id: new ObjectId("...") });
```

### Paginación

```typescript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const items = await collection.find({}).skip(skip).limit(limit).toArray();

const total = await collection.countDocuments({});
```

### Índices

```typescript
// Crear índice único
await collection.createIndex({ email: 1 }, { unique: true });

// Crear índice de texto para búsquedas
await collection.createIndex({ name: "text", description: "text" });

// Búsqueda de texto
const results = await collection.find({ $text: { $search: "término de búsqueda" } }).toArray();
```

## Recursos

- [Documentación de MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB University (cursos gratuitos)](https://university.mongodb.com/)
