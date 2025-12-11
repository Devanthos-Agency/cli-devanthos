import { ObjectId, type WithId, type Document } from "mongodb";
import { getCollection } from "../mongodb";

// Interfaz del usuario
export interface User extends Document {
    _id?: ObjectId;
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: "user" | "admin" | "moderator";
    isActive: boolean;
    emailVerified?: Date;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Nombre de la colección
const COLLECTION_NAME = "users";

// Obtener la colección tipada
export async function getUsersCollection() {
    return getCollection<User>(COLLECTION_NAME);
}

// Crear usuario
export async function createUser(
    userData: Omit<User, "_id" | "createdAt" | "updatedAt">
): Promise<ObjectId> {
    const collection = await getUsersCollection();

    const now = new Date();
    const result = await collection.insertOne({
        ...userData,
        createdAt: now,
        updatedAt: now
    } as User);

    return result.insertedId;
}

// Buscar usuario por ID
export async function findUserById(id: string): Promise<WithId<User> | null> {
    const collection = await getUsersCollection();
    return collection.findOne({ _id: new ObjectId(id) });
}

// Buscar usuario por email
export async function findUserByEmail(email: string): Promise<WithId<User> | null> {
    const collection = await getUsersCollection();
    return collection.findOne({ email: email.toLowerCase() });
}

// Actualizar usuario
export async function updateUser(
    id: string,
    updates: Partial<Omit<User, "_id" | "createdAt">>
): Promise<boolean> {
    const collection = await getUsersCollection();

    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...updates,
                updatedAt: new Date()
            }
        }
    );

    return result.modifiedCount > 0;
}

// Eliminar usuario
export async function deleteUser(id: string): Promise<boolean> {
    const collection = await getUsersCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}

// Listar usuarios con paginación
export async function listUsers(
    page: number = 1,
    limit: number = 10,
    filter: Partial<User> = {}
): Promise<{ users: WithId<User>[]; total: number; pages: number }> {
    const collection = await getUsersCollection();

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        collection.find(filter).skip(skip).limit(limit).toArray(),
        collection.countDocuments(filter)
    ]);

    return {
        users,
        total,
        pages: Math.ceil(total / limit)
    };
}

// Actualizar último login
export async function updateLastLogin(id: string): Promise<void> {
    const collection = await getUsersCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { lastLogin: new Date() } });
}

// Verificar si existe un email
export async function emailExists(email: string): Promise<boolean> {
    const collection = await getUsersCollection();
    const count = await collection.countDocuments({ email: email.toLowerCase() });
    return count > 0;
}
