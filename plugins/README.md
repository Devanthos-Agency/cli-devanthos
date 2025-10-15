# 🔌 Plugins de Devanthos

Sistema de plugins para extender la funcionalidad de los proyectos generados con Devanthos CLI.

## 📦 Plugins Disponibles

### 1. **Analytics Plugin** (`@devanthos/plugin-analytics`)

Integración de analytics (Google Analytics, Vercel Analytics).

**Frameworks:** Astro, Next.js

**Dependencias:**

- `@vercel/analytics`

**Archivos creados:**

- `src/components/Analytics.astro` (Astro)
- `components/Analytics.tsx` (Next.js)

**Variables de entorno:**

- `NEXT_PUBLIC_GA_ID` o `PUBLIC_GA_ID`

---

### 2. **SEO Plugin** (`@devanthos/plugin-seo`)

Optimización SEO completa (meta tags, sitemap, robots.txt).

**Frameworks:** Astro, Next.js

**Dependencias:**

- Astro: `@astrojs/sitemap`, `@astrojs/rss`
- Next.js: `next-seo`, `next-sitemap`

**Archivos creados:**

- `src/components/SEO.astro` (Astro)
- `components/SEO.tsx` (Next.js)
- `public/robots.txt`
- `next-sitemap.config.js` (Next.js)

**Variables de entorno:**

- `SITE_URL`

---

### 3. **Auth Plugin** (`@devanthos/plugin-auth`)

Sistema de autenticación completo.

**Frameworks:** Next.js, Expo

**Dependencias:**

- Next.js: `next-auth`, `@auth/prisma-adapter`, `bcryptjs`
- Expo: `expo-auth-session`, `expo-secure-store`

**Archivos creados:**

- `app/api/auth/[...nextauth]/route.ts` (Next.js)
- `middleware.ts` (Next.js)
- `utils/auth.ts` (Expo)

**Variables de entorno:**

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`

---

### 4. **Database Plugin** (`@devanthos/plugin-database`)

Configuración de base de datos con Prisma.

**Frameworks:** Next.js, Astro

**Dependencias:**

- `prisma`, `@prisma/client`

**Archivos creados:**

- `prisma/schema.prisma`
- `lib/prisma.ts`

**Variables de entorno:**

- `DATABASE_URL`

**Comandos post-instalación:**

```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

---

### 5. **Content Plugin** (`@devanthos/plugin-content`)

Sistema de gestión de contenido con MDX.

**Frameworks:** Astro, Next.js

**Dependencias:**

- Astro: `@astrojs/mdx`, `@astrojs/rss`, `reading-time`
- Next.js: `next-mdx-remote`, `gray-matter`, `reading-time`

**Archivos creados:**

- `src/content/config.ts` (Astro)
- `lib/mdx.ts` (Next.js)
- Posts de ejemplo

---

### 6. **Stripe Plugin** (`@devanthos/plugin-stripe`)

Integración de pagos con Stripe.

**Frameworks:** Next.js

**Dependencias:**

- `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`

**Archivos creados:**

- `lib/stripe.ts`
- `app/api/checkout/route.ts`
- `app/api/webhook/route.ts`
- `components/CheckoutButton.tsx`

**Variables de entorno:**

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

### 7. **Expo Auth Plugin** (`@devanthos/plugin-expo-auth`)

Autenticación para aplicaciones móviles.

**Frameworks:** Expo

**Dependencias:**

- `expo-auth-session`, `expo-crypto`, `expo-secure-store`

**Archivos creados:**

- `context/AuthContext.tsx`
- `screens/LoginScreen.tsx`

**Variables de entorno:**

- `API_URL`

---

## 🛠️ Estructura de un Plugin

Cada plugin sigue esta estructura:

```javascript
export default {
    name: "@devanthos/plugin-name",
    version: "1.0.0",
    description: "Descripción del plugin",

    // Hook después de clonar template
    async afterClone({ projectName, framework }) {
        // Lógica personalizada
    },

    // Dependencias a instalar
    dependencies: {
        astro: ["pkg1", "pkg2"],
        next: ["pkg3", "pkg4"]
    },

    // Dependencias de desarrollo
    devDependencies: {
        next: ["pkg5"]
    },

    // Archivos a crear
    files: {
        next: [
            {
                path: "lib/example.ts",
                content: "// Contenido del archivo"
            }
        ]
    },

    // Información post-instalación
    postInstall: {
        message: "Plugin configurado exitosamente",
        envVars: ["VAR1", "VAR2"],
        instructions: ["Paso 1", "Paso 2"]
    }
};
```

---

## 🔄 Ciclo de Vida

1. **beforeClone** - Antes de clonar el template
2. **afterClone** - Después de clonar (aquí se ejecutan los plugins)
3. **beforeInstall** - Antes de instalar dependencias
4. **afterInstall** - Después de instalar
5. **onComplete** - Al finalizar todo
6. **onError** - Si hay errores

---

## 🚀 Uso

Los plugins se aplican automáticamente cuando usas un preset:

```bash
# Modo interactivo
npx create-devanthos-app

# Modo CLI
npx create-devanthos-app mi-blog -p blog
```

El preset `blog` automáticamente aplicará:

- ✅ `@devanthos/plugin-content`
- ✅ `@devanthos/plugin-seo`

---

## 📝 Notas

- Los plugins son **informativos** por ahora (muestran mensajes)
- En una futura versión crearán archivos automáticamente
- Cada plugin incluye instrucciones de configuración
- Las dependencias se listan pero no se instalan automáticamente (aún)

---

## 🔮 Roadmap

### v1.6.0

- [ ] Instalación automática de dependencias de plugins
- [ ] Creación automática de archivos
- [ ] Plugin de generador de componentes
- [ ] Plugins comunitarios

### v2.0.0

- [ ] Marketplace de plugins
- [ ] Plugins desde npm
- [ ] Sistema de templates de plugins

---

**Última actualización:** 14 de enero de 2025
**Versión del sistema:** 1.5.1
