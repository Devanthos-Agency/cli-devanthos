import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { createUser, listUsers, findUserByEmail, emailExists, type User } from "@/lib/models/user";

// GET: Listar usuarios con paginación
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const role = searchParams.get("role") as User["role"] | null;

        // Construir filtro
        const filter: Partial<User> = {};
        if (role) {
            filter.role = role;
        }

        const result = await listUsers(page, limit, filter);

        // Sanitizar datos (no enviar passwords)
        const sanitizedUsers = result.users.map(({ password, ...user }) => user);

        return NextResponse.json({
            users: sanitizedUsers,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: result.pages
            }
        });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

// POST: Crear nuevo usuario
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar campos requeridos
        if (!body.name || !body.email) {
            return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 });
        }

        // Verificar si el email ya existe
        if (await emailExists(body.email)) {
            return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
        }

        // Crear usuario
        const userId = await createUser({
            name: body.name,
            email: body.email.toLowerCase(),
            role: body.role || "user",
            isActive: true,
            image: body.image
        });

        return NextResponse.json(
            {
                message: "Usuario creado exitosamente",
                userId: userId.toString()
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
