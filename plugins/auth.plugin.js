/**
 * @devanthos/plugin-auth
 *
 * Plugin para autenticación (NextAuth.js, Clerk, Auth0)
 */

export default {
    name: "@devanthos/plugin-auth",
    version: "1.0.0",
    description: "Agrega sistema de autenticación al proyecto",

    async afterClone({ _projectName, framework }) {
        console.log(`🔐 [Auth Plugin] Configurando autenticación para ${framework}...`);
    },

    dependencies: {
        next: ["next-auth", "@auth/prisma-adapter", "bcryptjs"],
        expo: ["expo-auth-session", "expo-crypto", "expo-secure-store"]
    },

    files: {
        next: [
            {
                path: "app/api/auth/[...nextauth]/route.ts",
                content: `import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
`
            },
            {
                path: "middleware.ts",
                content: `import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
`
            }
        ],
        expo: [
            {
                path: "utils/auth.ts",
                content: `import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}
`
            }
        ]
    },

    postInstall: {
        message: "🔐 Autenticación configurada. Configura las variables de entorno para NextAuth.",
        envVars: ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "DATABASE_URL"],
        instructions: [
            "1. Configura tu base de datos en .env",
            "2. Ejecuta: npx prisma generate",
            "3. Ejecuta: npx prisma db push",
            "4. Genera NEXTAUTH_SECRET: openssl rand -base64 32"
        ]
    }
};
