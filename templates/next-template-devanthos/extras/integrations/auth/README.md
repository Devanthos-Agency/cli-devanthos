# 🔐 Integración con NextAuth.js

Esta integración te permite agregar autenticación a tu proyecto Next.js usando NextAuth.js v5.

## Instalación

```bash
npm install next-auth@beta
# o
pnpm add next-auth@beta
```

## Configuración

### 1. Variables de entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Secreto para firmar tokens (genera uno con: openssl rand -base64 32)
AUTH_SECRET=tu_secreto_aqui

# URL de tu aplicación
NEXTAUTH_URL=http://localhost:3000

# Proveedores OAuth (opcionales)
AUTH_GOOGLE_ID=tu_google_client_id
AUTH_GOOGLE_SECRET=tu_google_client_secret

AUTH_GITHUB_ID=tu_github_client_id
AUTH_GITHUB_SECRET=tu_github_client_secret
```

### 2. Copiar archivos

Copia los archivos de esta carpeta a tu proyecto:

- `auth.ts` → `src/auth.ts`
- `middleware.ts` → `src/middleware.ts`
- `app/api/auth/[...nextauth]/route.ts` → `src/app/api/auth/[...nextauth]/route.ts`
- `components/auth/` → `src/components/auth/`

## Uso

### Proteger rutas con middleware

El archivo `middleware.ts` protege automáticamente las rutas configuradas:

```typescript
// src/middleware.ts
export { auth as middleware } from "@/auth";

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"]
};
```

### Obtener sesión en Server Components

```typescript
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <div>Bienvenido, {session.user?.name}</div>;
}
```

### Obtener sesión en Client Components

```tsx
"use client";

import { useSession } from "next-auth/react";

export function UserProfile() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Cargando...</p>;
    if (!session) return <p>No autenticado</p>;

    return <p>Hola, {session.user?.name}</p>;
}
```

### Botones de login/logout

```tsx
import { LoginButton, LogoutButton } from "@/components/auth/auth-buttons";

export function Navbar() {
    return (
        <nav>
            <LoginButton />
            <LogoutButton />
        </nav>
    );
}
```

## Proveedores disponibles

### Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y configura OAuth 2.0
3. Agrega `http://localhost:3000/api/auth/callback/google` como URI de redirección

### GitHub

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crea una nueva OAuth App
3. Agrega `http://localhost:3000/api/auth/callback/github` como callback URL

### Credenciales (Email/Password)

El proveedor de credenciales está incluido. Debes implementar la validación contra tu base de datos.

## Recursos

- [Documentación oficial de NextAuth.js](https://authjs.dev/)
- [Guía de migración a v5](https://authjs.dev/getting-started/migrating-to-v5)
