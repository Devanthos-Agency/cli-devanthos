import { MongoClient, type MongoClientOptions } from "mongodb";

// Verificar que existe la URI de MongoDB
if (!process.env.MONGODB_URI) {
    throw new Error("Por favor, define la variable de entorno MONGODB_URI en .env.local");
}

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
    // Opciones de conexión recomendadas
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
    // En desarrollo, usar una variable global para preservar la conexión
    // entre recargas de HMR (Hot Module Replacement)
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // En producción, crear una nueva conexión
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Exportar la promesa del cliente
export default clientPromise;

// Función helper para obtener la base de datos
export async function getDatabase(dbName?: string) {
    const client = await clientPromise;
    return client.db(dbName || process.env.MONGODB_DB);
}

// Función helper para obtener una colección
export async function getCollection<T extends Document>(collectionName: string, dbName?: string) {
    const db = await getDatabase(dbName);
    return db.collection<T>(collectionName);
}

// Función para verificar la conexión
export async function checkConnection(): Promise<boolean> {
    try {
        const client = await clientPromise;
        await client.db().admin().ping();
        return true;
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        return false;
    }
}

// Función para cerrar la conexión (útil para tests)
export async function closeConnection(): Promise<void> {
    const client = await clientPromise;
    await client.close();
}
