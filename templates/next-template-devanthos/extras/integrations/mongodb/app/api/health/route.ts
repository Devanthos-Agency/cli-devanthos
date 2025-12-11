import { NextResponse } from "next/server";
import clientPromise, { checkConnection } from "@/lib/mongodb";

// Endpoint de ejemplo para verificar la conexión
export async function GET() {
    try {
        // Verificar conexión
        const isConnected = await checkConnection();

        if (!isConnected) {
            return NextResponse.json({ error: "No se pudo conectar a MongoDB" }, { status: 500 });
        }

        // Ejemplo: obtener estadísticas de la base de datos
        const client = await clientPromise;
        const db = client.db();

        // Obtener lista de colecciones
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Obtener estadísticas
        const stats = await db.stats();

        return NextResponse.json({
            status: "connected",
            database: db.databaseName,
            collections: collectionNames,
            stats: {
                documents: stats.objects,
                dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
                storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
                indexes: stats.indexes
            }
        });
    } catch (error) {
        console.error("Error en health check de MongoDB:", error);
        return NextResponse.json({ error: "Error al verificar la conexión" }, { status: 500 });
    }
}
