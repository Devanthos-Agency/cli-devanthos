# 🔌 Sistema de Plugins - Devanthos CLI

Sistema modular de plugins para extender proyectos generados con `create-devanthos-app`.

## 📂 Nueva Estructura

Cada plugin ahora tiene su propia carpeta con:

```
plugins/
├── stripe/
│   ├── src/                      # Código fuente del plugin
│   │   ├── lib/
│   │   │   └── stripe.ts
│   │   ├── app/api/
│   │   │   ├── checkout/
│   │   │   └── webhook/
│   │   └── components/
│   │       └── CheckoutButton.tsx
│   ├── plugin.json               # Metadata del plugin
│   └── STRIPE.md                 # Documentación completa
│
├── analytics/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics.astro   # Para Astro
│   │   │   └── Analytics.tsx     # Para Next.js
│   │   └── lib/
│   │       └── analytics.ts
│   ├── plugin.json
│   └── ANALYTICS.md
│
└── [otros plugins]/
```

## 🎯 Estructura de plugin.json

Cada plugin tiene un archivo `plugin.json` con su metadata:

```json
{
    "name": "@devanthos/plugin-stripe",
    "version": "1.0.0",
    "description": "Integración completa de pagos con Stripe",
    "author": "Devanthos",
    "license": "MIT",
    "framework": "next",
    "dependencies": {
        "stripe": "^14.0.0",
        "@stripe/stripe-js": "^2.4.0"
    },
    "envVars": ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    "files": [
        {
            "source": "src/lib/stripe.ts",
            "destination": "lib/stripe.ts"
        },
        {
            "source": "src/app/api/checkout/route.ts",
            "destination": "app/api/checkout/route.ts"
        }
    ]
}
```

## 📦 Plugins Disponibles

### Producción (Carpetas Completas)

| Plugin        | Framework      | Archivos | Docs                                     |
| ------------- | -------------- | -------- | ---------------------------------------- |
| **Stripe**    | Next.js        | 4        | [STRIPE.md](./stripe/STRIPE.md)          |
| **Analytics** | Astro, Next.js | 3        | [ANALYTICS.md](./analytics/ANALYTICS.md) |

### En Desarrollo (Archivos .js legacy)

Los siguientes plugins están en formato antiguo y serán migrados:

- `seo.plugin.js` → `seo/`
- `auth.plugin.js` → `auth/`
- `database.plugin.js` → `database/`
- `content.plugin.js` → `content/`
- `expo-auth.plugin.js` → `expo-auth/`

## 🚀 Cómo Funciona

### 1. El usuario crea un proyecto

```bash
npx create-devanthos-app mi-tienda -p ecommerce
```

### 2. El CLI detecta los plugins del preset

```javascript
// Preset "ecommerce"
{
    plugins: ["@devanthos/plugin-stripe", "@devanthos/plugin-database", "@devanthos/plugin-auth"];
}
```

### 3. Se copian los archivos al proyecto

```
plugins/stripe/src/lib/stripe.ts
  → mi-tienda/lib/stripe.ts

plugins/stripe/src/app/api/checkout/route.ts
  → mi-tienda/app/api/checkout/route.ts
```

### 4. Se muestran las instrucciones

```
💳 Plugin Stripe instalado

📝 Configuración requerida:
   1. Agrega las siguientes variables de entorno:
      - STRIPE_SECRET_KEY
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      - STRIPE_WEBHOOK_SECRET

   2. Lee la documentación completa en:
      mi-tienda/docs/STRIPE.md
```

## 📖 Documentación de Plugins

Cada plugin incluye un archivo `.md` con:

- ✅ Instrucciones de configuración
- ✅ Ejemplos de uso
- ✅ Variables de entorno necesarias
- ✅ Troubleshooting
- ✅ Recursos adicionales

**Ejemplo:** [plugins/stripe/STRIPE.md](./stripe/STRIPE.md)

## 🛠️ Crear un Nuevo Plugin

### 1. Crear la estructura de carpetas

```bash
mkdir -p plugins/mi-plugin/src
```

### 2. Agregar el código fuente

```bash
plugins/mi-plugin/
└── src/
    ├── components/
    ├── lib/
    └── utils/
```

### 3. Crear plugin.json

```json
{
    "name": "@devanthos/plugin-mi-plugin",
    "version": "1.0.0",
    "description": "Descripción del plugin",
    "framework": "next",
    "dependencies": {
        "paquete": "^1.0.0"
    },
    "envVars": ["MI_API_KEY"],
    "files": [
        {
            "source": "src/lib/example.ts",
            "destination": "lib/example.ts"
        }
    ]
}
```

### 4. Crear documentación

```markdown
# 🎯 Plugin Mi Plugin

Descripción del plugin...

## Instalación

## Configuración

## Uso

## Troubleshooting
```

### 5. Registrar en el sistema

```javascript
// plugins/index.js
import miPlugin from "./mi-plugin/plugin.json" assert { type: "json" };

export const AVAILABLE_PLUGINS = {
    "@devanthos/plugin-mi-plugin": miPlugin
    // ... otros plugins
};
```

## 🎨 Ventajas de la Nueva Estructura

### ✅ Código Organizado

- Cada plugin es independiente
- Fácil de mantener
- Fácil de versionar

### ✅ Documentación Clara

- Un .md por plugin
- Ejemplos específicos
- Instrucciones paso a paso

### ✅ Reutilizable

- Código listo para copiar
- No requiere transformaciones
- TypeScript completo

### ✅ Extensible

- Fácil agregar nuevos plugins
- Plugin = Carpeta + JSON + MD
- No modificar código del CLI

## 🔄 Migración de Plugins Legacy

Los archivos `.plugin.js` antiguos se están migrando a la nueva estructura:

```bash
# Antes
plugins/
├── stripe.plugin.js    # Todo en un archivo
└── seo.plugin.js

# Después
plugins/
├── stripe/
│   ├── src/           # Código separado
│   ├── plugin.json    # Metadata
│   └── STRIPE.md      # Docs
└── seo/
    ├── src/
    ├── plugin.json
    └── SEO.md
```

## 📊 Estado de Migración

| Plugin    | Estado       | Carpeta      | Docs |
| --------- | ------------ | ------------ | ---- |
| Stripe    | ✅ Migrado   | `/stripe`    | ✅   |
| Analytics | ✅ Migrado   | `/analytics` | ✅   |
| SEO       | 🚧 Pendiente | -            | -    |
| Auth      | 🚧 Pendiente | -            | -    |
| Database  | 🚧 Pendiente | -            | -    |
| Content   | 🚧 Pendiente | -            | -    |
| Expo Auth | 🚧 Pendiente | -            | -    |

## 🧪 Testing

```bash
# Test de carga de plugins
node test-plugins.js

# Test de estructura
node test-plugin-structure.js
```

## 📝 Ejemplo Completo: Plugin Stripe

### Estructura

```
plugins/stripe/
├── src/
│   ├── lib/
│   │   └── stripe.ts                 # Cliente de Stripe
│   ├── app/api/
│   │   ├── checkout/
│   │   │   └── route.ts             # API de checkout
│   │   └── webhook/
│   │       └── route.ts             # Webhook handler
│   └── components/
│       └── CheckoutButton.tsx        # Componente UI
├── plugin.json                       # Metadata
└── STRIPE.md                         # Documentación (300+ líneas)
```

### plugin.json

```json
{
    "name": "@devanthos/plugin-stripe",
    "framework": "next",
    "dependencies": {
        "stripe": "^14.0.0"
    },
    "files": [...]
}
```

### STRIPE.md

- Configuración completa
- Ejemplos de uso
- Webhook setup
- Tarjetas de prueba
- Troubleshooting
- Seguridad

## 🚀 Próximos Pasos

### v1.5.3

- [ ] Migrar SEO plugin
- [ ] Migrar Auth plugin
- [ ] Migrar Database plugin
- [ ] Script de copia automática de archivos

### v1.6.0

- [ ] Instalación automática de dependencias
- [ ] Creación automática de archivos
- [ ] Merge de archivos existentes
- [ ] Plugin CLI tool

## 📚 Recursos

- [Crear un Plugin](./docs/CREATING_PLUGINS.md)
- [API de Plugins](./docs/PLUGIN_API.md)
- [Contribuir](./docs/CONTRIBUTING.md)

---

**Sistema de Plugins v2.0**
**Última actualización:** 14 de enero de 2025
