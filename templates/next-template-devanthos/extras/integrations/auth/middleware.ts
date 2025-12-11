export { auth as middleware } from "@/auth";

// Configurar las rutas que deben ser protegidas
export const config = {
    matcher: [
        // Proteger rutas del dashboard
        "/dashboard/:path*",
        // Proteger rutas del perfil
        "/profile/:path*",
        // Proteger rutas de admin
        "/admin/:path*",
        // Excluir archivos estáticos y API de auth
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)"
    ]
};
