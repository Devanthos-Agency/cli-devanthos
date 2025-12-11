import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// Tipo extendido para el usuario
declare module "next-auth" {
    interface User {
        id?: string;
        role?: string;
    }
    interface Session {
        user: {
            id: string;
            role?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

// Configuración de NextAuth
const config: NextAuthConfig = {
    providers: [
        // Proveedor de Google
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        }),

        // Proveedor de GitHub
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET
        }),

        // Proveedor de credenciales (email/password)
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@ejemplo.com"
                },
                password: {
                    label: "Contraseña",
                    type: "password"
                }
            },
            async authorize(credentials) {
                // ⚠️ IMPORTANTE: Implementa tu propia lógica de autenticación aquí
                // Ejemplo con validación básica:

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // TODO: Buscar usuario en tu base de datos
                // const user = await db.user.findUnique({
                //   where: { email: credentials.email }
                // });

                // TODO: Verificar contraseña
                // const isValid = await bcrypt.compare(credentials.password, user.password);

                // Ejemplo de usuario hardcodeado (SOLO PARA DESARROLLO)
                if (credentials.email === "demo@demo.com" && credentials.password === "demo123") {
                    return {
                        id: "1",
                        name: "Usuario Demo",
                        email: "demo@demo.com",
                        role: "user"
                    };
                }

                return null;
            }
        })
    ],

    // Páginas personalizadas
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/auth/error"
        // verifyRequest: "/auth/verify-request",
        // newUser: "/auth/new-user",
    },

    // Callbacks
    callbacks: {
        // Modificar el token JWT
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },

        // Modificar la sesión
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },

        // Autorizar acceso (para middleware)
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnProfile = nextUrl.pathname.startsWith("/profile");

            // Rutas protegidas
            if (isOnDashboard || isOnProfile) {
                if (isLoggedIn) return true;
                return false; // Redirigir a login
            }

            return true;
        }
    },

    // Configuración de sesión
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 días
    },

    // Opciones de debug (solo desarrollo)
    debug: process.env.NODE_ENV === "development"
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
