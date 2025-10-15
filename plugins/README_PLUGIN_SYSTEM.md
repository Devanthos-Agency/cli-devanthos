# 🔌 Sistema de Plugins v2.0 - Devanthos CLI

Sistema modular de plugins para Devanthos CLI que permite extender la funcionalidad de tus proyectos con componentes, integraciones y configuraciones predefinidas.

## 📋 Tabla de Contenidos

- [Qué es un Plugin](#qué-es-un-plugin)
- [Estructura Modular](#estructura-modular)
- [Plugins Disponibles](#plugins-disponibles)
- [Instalar Plugins](#instalar-plugins)
- [Crear Plugins](#crear-plugins)
- [API del Plugin Manager](#api-del-plugin-manager)
- [Migración desde v1.x](#migración-desde-v1x)

---

## ✨ Qué es un Plugin

Un **plugin de Devanthos** es un paquete autocontenido que incluye:

- ✅ Código fuente (componentes, utilidades, API routes)
- ✅ Dependencias NPM requeridas
- ✅ Variables de entorno necesarias
- ✅ Instrucciones de configuración
- ✅ Documentación completa

Los plugins permiten agregar funcionalidad a tus proyectos con un solo comando, sin necesidad de configuración manual.

---

## 📁 Estructura Modular

### Anatomía de un Plugin

```
plugins/
└── mi-plugin/
    ├── plugin.json          # Metadata y configuración
    ├── PLUGIN.md            # Documentación
    └── src/                 # Código fuente
        ├── components/      # Componentes React/Astro
        ├── lib/             # Utilidades y helpers
        ├── app/             # API routes (Next.js)
        ├── utils/           # Funciones auxiliares
        └── ...
```

### plugin.json

Archivo de configuración que define el plugin:

```json
{
    "name": "@devanthos/plugin-example",
    "version": "1.0.0",
    "description": "Descripción del plugin",
    "author": "Devanthos",
    "license": "MIT",

    "frameworks": ["next", "astro"],

    "dependencies": {
        "next": {
            "package-name": "^1.0.0"
        },
        "astro": {
            "other-package": "^2.0.0"
        }
    },

    "envVars": ["API_KEY", "SECRET_TOKEN"],

    "files": [
        {
            "framework": "next",
            "source": "src/components/Example.tsx",
            "destination": "components/Example.tsx"
        }
    ],

    "postInstall": {
        "message": "✅ Plugin instalado",
        "instructions": [
            "1. Configura las variables de entorno",
            "2. Importa el componente",
            "3. ..."
        ]
    },

    "features": ["Feature 1", "Feature 2"]
}
```

### Campos del plugin.json

| Campo             | Tipo   | Descripción                     | Requerido |
| ----------------- | ------ | ------------------------------- | --------- |
| `name`            | string | Nombre único del plugin         | ✅        |
| `version`         | string | Versión semántica               | ✅        |
| `description`     | string | Descripción breve               | ✅        |
| `author`          | string | Autor del plugin                | ❌        |
| `license`         | string | Licencia (MIT, etc.)            | ❌        |
| `frameworks`      | array  | Frameworks soportados           | ✅        |
| `dependencies`    | object | NPM dependencies por framework  | ❌        |
| `devDependencies` | object | Dev dependencies                | ❌        |
| `envVars`         | array  | Variables de entorno requeridas | ❌        |
| `files`           | array  | Archivos a copiar               | ✅        |
| `postInstall`     | object | Instrucciones post-instalación  | ❌        |
| `features`        | array  | Lista de características        | ❌        |

---

## 📦 Plugins Disponibles

### 📊 Analytics

**Framework:** Astro, Next.js  
**Versión:** 1.0.0

Integración de Google Analytics y Vercel Analytics para tracking de usuarios.

```bash
devanthos-plugins install @devanthos/plugin-analytics
```

**Features:**

- Google Analytics 4
- Vercel Analytics
- Componentes listos para usar
- TypeScript

---

### 🔐 Auth

**Framework:** Next.js, Expo  
**Versión:** 1.0.0

Sistema de autenticación completo con NextAuth.js o Expo Authentication.

```bash
devanthos-plugins install @devanthos/plugin-auth
```

**Features:**

- NextAuth.js (Next.js)
- OAuth providers (Google, GitHub, etc.)
- Session management
- Protected routes
- AuthContext para Expo

---

### 🗄️ Database

**Framework:** Next.js, Astro  
**Versión:** 1.0.0

Integración con Prisma ORM para bases de datos relacionales.

```bash
devanthos-plugins install @devanthos/plugin-database
```

**Features:**

- Prisma ORM
- TypeScript types
- Schema pre-configurado
- Database migrations

---

### 📝 Content

**Framework:** Astro, Next.js  
**Versión:** 1.0.0

Sistema de contenido con MDX para blogs y documentación.

```bash
devanthos-plugins install @devanthos/plugin-content
```

**Features:**

- MDX support
- Content collections
- Blog posts
- Markdown utilities

---

### 🔍 SEO

**Framework:** Astro, Next.js  
**Versión:** 1.0.0

Optimización SEO con meta tags, sitemaps y robots.txt.

```bash
devanthos-plugins install @devanthos/plugin-seo
```

**Features:**

- Componente SEO
- Meta tags dinámicos
- Sitemap generation
- robots.txt

---

### 💳 Stripe

**Framework:** Next.js  
**Versión:** 1.0.0

Integración completa con Stripe para pagos.

```bash
devanthos-plugins install @devanthos/plugin-stripe
```

**Features:**

- Stripe Checkout
- Webhook handling
- Subscription support
- TypeScript

---

### 📱 Expo Auth

**Framework:** Expo  
**Versión:** 1.0.0

Sistema de autenticación para apps móviles con Expo.

```bash
devanthos-plugins install @devanthos/plugin-expo-auth
```

**Features:**

- AuthContext
- Login/Register screens
- Token management
- Secure storage

---

### 💰 Mercado Pago

**Framework:** Next.js  
**Versión:** 1.0.0

Integración con Mercado Pago para pagos en Latinoamérica.

```bash
devanthos-plugins install @devanthos/plugin-mercadopago
```

**Features:**

- Checkout completo
- Webhook IPN
- 8 países de LATAM
- Múltiples métodos de pago
- Componentes React

**Países soportados:** 🇦🇷 🇧🇷 🇨🇱 🇨🇴 🇲🇽 🇵🇪 🇺🇾 🇻🇪

---

## 🚀 Instalar Plugins

### Modo Interactivo

Ejecuta el instalador en la raíz de tu proyecto:

```bash
cd mi-proyecto
npx devanthos-plugins install
```

El instalador:

1. Detecta el framework automáticamente
2. Muestra plugins compatibles
3. Copia los archivos necesarios
4. Instala las dependencias
5. Muestra instrucciones de configuración

### Modo CLI

Instalar un plugin específico:

```bash
npx devanthos-plugins install @devanthos/plugin-stripe
```

Especificar framework manualmente:

```bash
npx devanthos-plugins install @devanthos/plugin-analytics --framework next
```

Saltar instalación de dependencias:

```bash
npx devanthos-plugins install @devanthos/plugin-auth --skip-deps
```

### Listar Plugins Disponibles

Ver todos los plugins:

```bash
npx devanthos-plugins list
```

Filtrar por framework:

```bash
npx devanthos-plugins list --framework next
npx devanthos-plugins list --framework astro
npx devanthos-plugins list --framework expo
```

---

## 🛠️ Crear Plugins

### 1. Crear Estructura

```bash
mkdir -p plugins/mi-plugin/src
cd plugins/mi-plugin
```

### 2. Crear plugin.json

```json
{
    "name": "@devanthos/plugin-mi-plugin",
    "version": "1.0.0",
    "description": "Mi plugin personalizado",
    "author": "Tu Nombre",
    "license": "MIT",
    "frameworks": ["next"],
    "dependencies": {
        "next": {
            "mi-dependencia": "^1.0.0"
        }
    },
    "envVars": ["MI_API_KEY"],
    "files": [
        {
            "framework": "next",
            "source": "src/components/MiComponente.tsx",
            "destination": "components/MiComponente.tsx"
        }
    ],
    "postInstall": {
        "message": "✅ Mi Plugin instalado",
        "instructions": ["1. Agrega MI_API_KEY a .env", "2. Importa el componente"]
    },
    "features": ["Feature 1", "Feature 2"]
}
```

### 3. Agregar Código Fuente

```
src/
├── components/
│   └── MiComponente.tsx
├── lib/
│   └── utils.ts
└── ...
```

### 4. Crear Documentación

Crea `MI-PLUGIN.md` con:

- Descripción
- Instalación
- Configuración
- Uso
- API Reference
- Ejemplos
- Troubleshooting

### 5. Validar Plugin

```bash
cd ../..  # Volver a raíz del CLI
node test-plugin-loader.js
```

---

## 🔧 API del Plugin Manager

### Cargar Plugins

```javascript
import { pluginManager } from "./utils/plugins.js";

// Descubrir y cargar plugins automáticamente
await pluginManager.discoverPlugins();
```

### Obtener Plugin

```javascript
const plugin = pluginManager.getPlugin("@devanthos/plugin-analytics");

console.log(plugin.name); // Nombre
console.log(plugin.version); // Versión
console.log(plugin.frameworks); // Frameworks soportados
console.log(plugin.files); // Archivos del plugin
```

### Listar Plugins

```javascript
// Todos los plugins modulares
const allPlugins = pluginManager.listAvailablePlugins();

// Plugins para Next.js
const nextPlugins = pluginManager.listAvailablePlugins("next");

// Plugins para Astro
const astroPlugins = pluginManager.listAvailablePlugins("astro");
```

### Instalar Plugin

```javascript
const results = await pluginManager.installPlugin(
    "@devanthos/plugin-stripe", // Nombre del plugin
    "/path/to/project", // Ruta del proyecto
    "next", // Framework
    {
        verbose: true, // Mostrar output
        skipDependencies: false // Instalar deps
    }
);

console.log(results.filesCopied); // Archivos copiados
console.log(results.dependenciesInstalled); // Deps instaladas
console.log(results.envVarsNeeded); // Env vars requeridas
console.log(results.errors); // Errores
```

---

## 🔄 Migración desde v1.x

### Estructura Anterior (v1.x)

```
plugins/
├── analytics.plugin.js
├── auth.plugin.js
└── ...
```

### Nueva Estructura (v2.0)

```
plugins/
├── analytics/
│   ├── plugin.json
│   ├── ANALYTICS.md
│   └── src/
├── auth/
│   ├── plugin.json
│   ├── AUTH.md
│   └── src/
└── ...
```

### Compatibilidad

El Plugin Loader v2.0 es **100% compatible** con plugins legacy (`.plugin.js`).

Ambos formatos funcionan simultáneamente:

- ✅ Plugins modulares (`plugin.json` + `src/`)
- ✅ Plugins legacy (`.plugin.js`)

### Migrar Plugin Legacy

1. **Crear carpeta del plugin:**

    ```bash
    mkdir plugins/mi-plugin
    ```

2. **Crear plugin.json:**
    - Extraer metadata del archivo `.js`
    - Definir archivos, dependencias, etc.

3. **Mover código a src/:**

    ```bash
    mkdir plugins/mi-plugin/src
    mv mi-codigo.tsx plugins/mi-plugin/src/
    ```

4. **Crear documentación:**

    ```bash
    touch plugins/mi-plugin/MI-PLUGIN.md
    ```

5. **Validar:**
    ```bash
    node test-plugin-loader.js
    ```

---

## 📊 Estadísticas

- **8 plugins modulares** disponibles
- **100% de tests pasando**
- **3 frameworks** soportados (Next.js, Astro, Expo)
- **Compatibilidad total** con plugins legacy

---

## 🎯 Próximos Pasos

### En desarrollo:

- [ ] Plugin Registry remoto
- [ ] Versionado de plugins
- [ ] Auto-updates
- [ ] Plugin marketplace
- [ ] CLI interactivo mejorado
- [ ] Templates de plugins

---

## 📚 Recursos

- [Documentación de Plugins](./README.md)
- [Crear tu Primer Plugin](./CREATING_PLUGINS.md)
- [API Reference](./API.md)
- [GitHub Issues](https://github.com/devanthos/cli/issues)

---

## 💡 Contribuir

¿Quieres crear un plugin? ¡Genial!

1. Fork el repositorio
2. Crea tu plugin siguiendo la estructura modular
3. Agrega tests
4. Crea un Pull Request

---

**Versión:** 2.0.0  
**Última actualización:** Octubre 2025  
**Licencia:** MIT  
**Autor:** Devanthos
