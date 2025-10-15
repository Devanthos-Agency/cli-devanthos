# 🔐 Plugin Auth - Devanthos

Sistema de autenticación completo para Next.js (con NextAuth.js) y Expo (con Secure Store).

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Protección de Rutas](#protección-de-rutas)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **NextAuth.js**: Autenticación completa para Next.js
- ✅ **Credentials Provider**: Login con email y contraseña
- ✅ **Prisma Adapter**: Integración con base de datos
- ✅ **JWT Sessions**: Sesiones seguras con JSON Web Tokens
- ✅ **Expo SecureStore**: Almacenamiento seguro para apps móviles
- ✅ **TypeScript**: Completamente tipado
- ✅ **Middleware**: Protección automática de rutas

---

## 📦 Instalación

### Next.js

```bash
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### Expo

```bash
npx expo install expo-auth-session expo-crypto expo-secure-store
```

---

## ⚙️ Configuración

### Next.js

#### 1. Variables de Entorno

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-generado"
```

Genera el secret:

```bash
openssl rand -base64 32
```

#### 2. Prisma Schema

Asegúrate de tener el schema de User configurado:

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String?
  password String
}
```

#### 3. Inicializar Base de Datos

```bash
npx prisma generate
npx prisma db push
```

### Expo

#### 1. Variables de Entorno

```env
# .env
API_URL="https://tu-api.com"
```

#### 2. Configurar AuthProvider

Envuelve tu app con el `AuthProvider`:

```tsx
// App.tsx
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return <AuthProvider>{/* Tu navegación y componentes */}</AuthProvider>;
}
```

---

## 🚀 Uso

### Next.js

#### Página de Login

```tsx
// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (result?.ok) {
            router.push("/dashboard");
        } else {
            alert("Error al iniciar sesión");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
}
```

#### Usar Sesión en Componentes

```tsx
// app/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Cargando...</div>;
    }

    if (!session) {
        return <div>No autenticado</div>;
    }

    return (
        <div>
            <h1>Bienvenido, {session.user?.name}</h1>
            <button onClick={() => signOut()}>Cerrar Sesión</button>
        </div>
    );
}
```

### Expo

#### Pantalla de Login

```tsx
import LoginScreen from "./screens/LoginScreen";

// El componente ya está implementado en src/screens/LoginScreen.tsx
// Solo importarlo y usarlo en tu navegación
```

#### Usar Auth en Componentes

```tsx
import { useAuth } from "./context/AuthContext";

export default function HomeScreen() {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    return (
        <View>
            <Text>Bienvenido, {user?.name}</Text>
            <Button title="Cerrar Sesión" onPress={logout} />
        </View>
    );
}
```

---

## 📚 API Reference

### Next.js - NextAuth

#### signIn()

```tsx
import { signIn } from "next-auth/react";

await signIn("credentials", {
    email: "user@example.com",
    password: "password123",
    redirect: false
});
```

#### signOut()

```tsx
import { signOut } from "next-auth/react";

await signOut({ redirect: true, callbackUrl: "/" });
```

#### useSession()

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
// status: 'loading' | 'authenticated' | 'unauthenticated'
```

### Expo - AuthContext

#### useAuth()

```tsx
const {
    user, // User | null
    loading, // boolean
    login, // (email, password) => Promise<void>
    logout, // () => Promise<void>
    isAuthenticated // boolean
} = useAuth();
```

---

## 🛡️ Protección de Rutas

### Next.js

El middleware ya está configurado para proteger rutas:

```typescript
// middleware.ts
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"]
};
```

Agrega más rutas protegidas:

```typescript
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/settings/:path*"]
};
```

### Protección en Server Components

```tsx
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return <div>Dashboard protegido</div>;
}
```

### Expo

```tsx
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProtectedScreen() {
    const { isAuthenticated } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigation.navigate("Login");
        }
    }, [isAuthenticated]);

    return <View>{/* Contenido protegido */}</View>;
}
```

---

## 📊 Best Practices

### 1. Hash de Contraseñas

```typescript
// Al registrar usuario
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash(password, 10);

await prisma.user.create({
    data: {
        email,
        password: hashedPassword
    }
});
```

### 2. Validación de Datos

```typescript
// Valida antes de autenticar
if (!email || !password) {
    throw new Error("Email y contraseña requeridos");
}

if (!email.includes("@")) {
    throw new Error("Email inválido");
}

if (password.length < 8) {
    throw new Error("Contraseña debe tener mínimo 8 caracteres");
}
```

### 3. Manejo de Errores

```typescript
try {
    await login(email, password);
} catch (error) {
    if (error instanceof Error) {
        console.error("Error de login:", error.message);
    }
}
```

---

## 🔧 Troubleshooting

### Next.js

#### Error: NEXTAUTH_SECRET no definido

```env
# Asegúrate de tener esto en .env
NEXTAUTH_SECRET="tu-secret-aqui"
```

#### Error: Database connection failed

```bash
# Verifica que Prisma esté generado
npx prisma generate

# Verifica la conexión a la base de datos
npx prisma db push
```

#### Sesión no persiste

```typescript
// Verifica que NEXTAUTH_URL esté configurado
NEXTAUTH_URL = "http://localhost:3000";

// En producción:
NEXTAUTH_URL = "https://tu-dominio.com";
```

### Expo

#### Token no se guarda

```typescript
// Verifica que SecureStore esté instalado
npx expo install expo-secure-store
```

#### Error de red al hacer login

```typescript
// Actualiza la URL de tu API en AuthContext.tsx
const response = await fetch("https://TU-API-AQUI.com/auth/login", {
    // ...
});
```

---

## 🎯 Ejemplos Avanzados

### Registro de Usuarios

```typescript
// app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const { email, password, name } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
}
```

### Roles y Permisos

```typescript
// Agregar rol al schema de Prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  password String
  role     String @default("user") // "user" | "admin"
}

// Verificar rol en middleware
export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin';
      }
      return !!token;
    },
  },
});
```

---

## 📚 Recursos

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Versión:** 1.0.0  
**Licencia:** MIT  
**Autor:** Devanthos
