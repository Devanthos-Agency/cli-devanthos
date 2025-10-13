# 📦 Presets y Configuración

## 🎯 Presets Predefinidos

Los presets son configuraciones predefinidas que te permiten crear proyectos optimizados para casos de uso específicos.

### Presets Disponibles

#### 1. `landing-page`

**Framework:** Astro  
**Descripción:** Página de aterrizaje optimizada para conversión

**Características:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ Analytics integrado
- ✅ Formulario de contacto
- ✅ SEO optimizado
- ✅ Sitemap y RSS

**Dependencias incluidas:**

- `@astrojs/sitemap`
- `@astrojs/rss`

**Uso:**

```bash
npx create-devanthos-app mi-landing -p landing-page
```

---

#### 2. `dashboard`

**Framework:** Next.js  
**Descripción:** Panel administrativo con autenticación y tablas

**Características:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ Autenticación (NextAuth)
- ✅ Base de datos (Prisma)
- ✅ Gráficos (Recharts)
- ✅ Tablas avanzadas

**Dependencias incluidas:**

- `recharts`
- `@tanstack/react-table`
- `next-auth`
- `prisma`

**Uso:**

```bash
npx create-devanthos-app mi-dashboard -p dashboard
```

---

#### 3. `blog`

**Framework:** Astro  
**Descripción:** Blog con MDX, RSS y sistema de contenido

**Características:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ MDX (Markdown con componentes)
- ✅ RSS Feed
- ✅ Sitemap automático
- ✅ SEO optimizado

**Dependencias incluidas:**

- `@astrojs/mdx`
- `@astrojs/rss`
- `@astrojs/sitemap`

**Uso:**

```bash
npx create-devanthos-app mi-blog -p blog
```

---

#### 4. `ecommerce`

**Framework:** Next.js  
**Descripción:** Tienda online con carrito y pagos

**Características:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ Carrito de compras
- ✅ Pasarela de pagos (Stripe)
- ✅ Base de datos (Prisma)
- ✅ Autenticación

**Dependencias incluidas:**

- `stripe`
- `@stripe/stripe-js`
- `zustand` (state management)
- `prisma`

**Uso:**

```bash
npx create-devanthos-app mi-tienda -p ecommerce
```

---

#### 5. `portfolio`

**Framework:** Astro  
**Descripción:** Portafolio personal con proyectos y blog

**Características:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint + Prettier
- ✅ MDX para contenido
- ✅ SEO optimizado
- ✅ Analytics

**Dependencias incluidas:**

- `@astrojs/mdx`
- `@astrojs/sitemap`

**Uso:**

```bash
npx create-devanthos-app mi-portfolio -p portfolio
```

---

#### 6. `mobile-app`

**Framework:** Expo  
**Descripción:** Aplicación móvil con React Native

**Características:**

- ✅ TypeScript
- ✅ Navegación configurada
- ✅ State management (Zustand)
- ✅ Autenticación preparada

**Dependencias incluidas:**

- `@react-navigation/native`
- `@react-navigation/stack`
- `zustand`
- `expo-secure-store`

**Uso:**

```bash
npx create-devanthos-app mi-app -p mobile-app
```

---

#### 7. `minimal`

**Framework:** Cualquiera  
**Descripción:** Configuración mínima para empezar desde cero

**Características:**

- ✅ TypeScript (opcional)
- ⚠️ Sin Tailwind
- ⚠️ Sin ESLint
- ⚠️ Sin Prettier

**Uso:**

```bash
npx create-devanthos-app mi-proyecto -p minimal
```

---

## ⚙️ Archivo de Configuración

### `devanthos.config.js`

El archivo de configuración permite personalizar el comportamiento del CLI y guardar preferencias del proyecto.

### Crear configuración

**Modo interactivo:**

```bash
npx create-devanthos-app
# Responde "Sí" cuando pregunte "¿Guardar configuración?"
```

**Modo CLI flags:**

```bash
npx create-devanthos-app mi-proyecto -p dashboard --save-config
```

### Estructura del archivo

```javascript
/**
 * Configuración de Devanthos
 * @see https://docs.devanthos.com/config
 */
export default {
    // Framework usado
    framework: "next",

    // Preset aplicado
    preset: "dashboard",

    // Gestor de paquetes preferido
    packageManager: "pnpm", // auto, npm, pnpm, yarn, bun

    // Configuración de Git
    git: {
        enabled: true,
        branch: "main",
        initialCommit: true
    },

    // Configuración de instalación
    install: {
        enabled: true,
        skipDev: false
    },

    // Características del proyecto
    features: {
        typescript: true,
        tailwind: true,
        eslint: true,
        prettier: true,
        auth: true, // Específico del preset
        database: true, // Específico del preset
        charts: true // Específico del preset
    },

    // Plugins adicionales
    plugins: ["@devanthos/plugin-auth", "@devanthos/plugin-database"],

    // Actualizar dependencias automáticamente
    updateDeps: true,

    // Auditoría de seguridad
    audit: false
};
```

### Opciones disponibles

#### `framework`

- **Tipo:** `string`
- **Valores:** `"astro"`, `"next"`, `"expo"`, `null`
- **Descripción:** Framework del proyecto

#### `preset`

- **Tipo:** `string | null`
- **Valores:** Ver lista de presets arriba
- **Descripción:** Preset aplicado

#### `packageManager`

- **Tipo:** `string`
- **Valores:** `"auto"`, `"npm"`, `"pnpm"`, `"yarn"`, `"bun"`
- **Default:** `"auto"`
- **Descripción:** Gestor de paquetes a usar

#### `git`

- **Tipo:** `object`
- **Propiedades:**
    - `enabled` (boolean): Inicializar Git
    - `branch` (string): Branch principal
    - `initialCommit` (boolean): Crear commit inicial

#### `install`

- **Tipo:** `object`
- **Propiedades:**
    - `enabled` (boolean): Instalar dependencias
    - `skipDev` (boolean): Saltar devDependencies

#### `features`

- **Tipo:** `object`
- **Descripción:** Características habilitadas del proyecto

#### `plugins`

- **Tipo:** `array`
- **Descripción:** Plugins adicionales a cargar

#### `updateDeps`

- **Tipo:** `boolean`
- **Default:** `true`
- **Descripción:** Actualizar dependencias a últimas versiones

#### `audit`

- **Tipo:** `boolean`
- **Default:** `false`
- **Descripción:** Ejecutar npm audit después de instalar

---

## 🚀 Ejemplos de Uso

### 1. Crear proyecto con preset

```bash
# Landing page
npx create-devanthos-app landing-empresa -p landing-page

# Dashboard admin
npx create-devanthos-app admin-panel -p dashboard

# Blog personal
npx create-devanthos-app mi-blog -p blog
```

### 2. Crear y guardar configuración

```bash
# Con preset
npx create-devanthos-app mi-proyecto -p dashboard --save-config

# Sin preset (manual)
npx create-devanthos-app mi-proyecto -t next --save-config
```

### 3. Listar presets disponibles

```bash
npx create-devanthos-app list-presets
```

**Salida:**

```
📦 Presets Disponibles:

  Landing Page
  ID: landing-page
  Framework: astro
  Página de aterrizaje optimizada para conversión

  Dashboard/Admin
  ID: dashboard
  Framework: next
  Panel administrativo con autenticación y tablas

  [...]
```

### 4. Modo interactivo con preset

```bash
npx create-devanthos-app
```

**Flujo:**

1. ¿Querés usar un preset? → **Sí**
2. Seleccioná un preset → **Dashboard/Admin**
3. Nombre del proyecto → **mi-dashboard**
4. ¿Instalar dependencias? → **Sí**
5. ¿Inicializar Git? → **Sí**
6. ¿Guardar configuración? → **Sí**

---

## 🎨 Personalizar Preset

Podés crear tu propio preset extendiendo uno existente:

```javascript
// devanthos.config.js
import { PRESETS } from "create-devanthos-app/utils/config.js";

export default {
    ...PRESETS.dashboard,

    // Personalizar
    packageManager: "pnpm",
    features: {
        ...PRESETS.dashboard.features,
        // Agregar más características
        i18n: true,
        darkMode: true
    },
    plugins: [...PRESETS.dashboard.plugins, "@devanthos/plugin-i18n"]
};
```

---

## 📊 Comparación de Presets

| Preset         | Framework  | TypeScript | Tailwind | Auth | Database | Mobile |
| -------------- | ---------- | ---------- | -------- | ---- | -------- | ------ |
| `landing-page` | Astro      | ✅         | ✅       | ❌   | ❌       | ❌     |
| `dashboard`    | Next.js    | ✅         | ✅       | ✅   | ✅       | ❌     |
| `blog`         | Astro      | ✅         | ✅       | ❌   | ❌       | ❌     |
| `ecommerce`    | Next.js    | ✅         | ✅       | ✅   | ✅       | ❌     |
| `portfolio`    | Astro      | ✅         | ✅       | ❌   | ❌       | ❌     |
| `mobile-app`   | Expo       | ✅         | ❌       | ✅   | ❌       | ✅     |
| `minimal`      | Cualquiera | ⚠️         | ❌       | ❌   | ❌       | ❌     |

---

## 🔧 Variables de Entorno

Controlar comportamiento del config con variables:

```bash
# Desactivar actualización de dependencias
DEVANTHOS_UPDATE_DEPS=false npx create-devanthos-app mi-proyecto -p blog

# Habilitar auditoría
DEVANTHOS_AUDIT=true npx create-devanthos-app mi-proyecto -p dashboard

# Modo verbose
DEVANTHOS_VERBOSE=true npx create-devanthos-app mi-proyecto -p ecommerce
```

---

## 📚 Recursos

- [Documentación completa](https://docs.devanthos.com/config)
- [Ejemplos de configuración](https://github.com/Devanthos-Agency/cli-devanthos/tree/main/examples)
- [Crear plugins personalizados](./examples/README.md)

---

**Hecho con 💜 por [Devanthos](https://devanthos.com)**
