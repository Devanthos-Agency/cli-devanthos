# Changelog

Todos los cambios importantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

---

## [2.2.0] - 2026-03-20

### 🏗️ REESTRUCTURACIÓN ESM + TESTING + REFACTOR

**✅ Migración a estructura `src/` según mejores prácticas ESM**  
**✅ Suite de tests con Vitest (44 tests)**  
**✅ Eliminación de código duplicado con módulo `create-project.js`**  
**✅ Node.js >=20 (LTS mantenido actualmente)**

### 🚀 Cambios Principales

#### Estructura `src/`

- 📁 **Código fuente reorganizado** en `src/` siguiendo la convención estándar de paquetes npm
    - `src/index.js` — CLI principal (antes `index.js`)
    - `src/utils/*.js` — Módulos utilitarios (antes `utils/*.js`)
    - Mejor separación entre código fuente, tests y templates

#### Nuevos Módulos

- 🆕 **`src/utils/create-project.js`** — Lógica centralizada de creación de proyectos
    - Elimina ~150 líneas de código duplicado entre modo interactivo y no-interactivo
    - Función única `createProject()` compartida por ambos modos
    - Maneja clonado, integraciones, Git init, instalación de deps y mensajes de éxito

- 🆕 **`src/utils/paths.js`** — Resolución centralizada de `CLI_ROOT`
    - Elimina cómputo repetido de `__filename` / `__dirname` en `clone.js` e `integrations.js`
    - Función `findCliRoot()` que busca hacia arriba hasta encontrar la raíz del CLI

### ✨ Agregado

#### Testing con Vitest

- 🧪 **44 tests unitarios** con Vitest
    - `tests/config.test.js` — 14 tests: presets, configuración, merge, validación
    - `tests/integrations.test.js` — 20 tests: aliases, parseo, validación, listado
    - `tests/validate.test.js` — 7 tests: validación de nombres de proyecto
    - `tests/clone.test.js` — 3 tests: templates disponibles y estructura
- 📄 **`vitest.config.js`** — Configuración del test runner (excluye templates y .agents)

#### Configuración ESM Moderna

- 📄 **`tsconfig.json`** — Verificación de tipos para JavaScript con `checkJs: true`
    - `target: ES2022`, `module: ESNext`, `moduleResolution: NodeNext`
- 📦 **`package.json`** actualizado
    - Campo `exports` con configuración moderna
    - Campo `main` apuntando a `./src/index.js`
    - `engines.node` actualizado de `>=16.0.0` a `>=20`
    - Script `prepublishOnly` ahora ejecuta tests antes de publicar

### 🔄 Cambiado

- **`package.json`**
    - `bin` → `./src/index.js`
    - `files` → `["src/", "templates/", "README.md"]`
    - `scripts.test` → `vitest` (antes `node index.js`)
    - `scripts.dev` → `node src/index.js`
    - `scripts.lint` → `eslint src/`
    - `scripts.prepublishOnly` → `npm run test:run && npm run lint`

- **`src/index.js`** — Simplificado
    - Eliminados imports no utilizados: `ora`, `path`, `cloneTemplate`, `installDeps`, `initGitRepo`, `copyIntegration`, `appendEnvVars`
    - `main()` ahora delega a `createProject()` en lugar de duplicar toda la lógica
    - `createProjectNonInteractive()` igualmente refactorizado
    - Ruta de `package.json` actualizada: `../package.json` (relativo a `src/`)

- **`src/utils/clone.js`** — Usa `CLI_ROOT` centralizado de `paths.js`
- **`src/utils/integrations.js`** — Usa `CLI_ROOT` centralizado de `paths.js`
- **`src/utils/update.js`** — Ruta de `package.json` actualizada: `../../package.json`

### 📊 Estadísticas

- **Archivos nuevos:** 5 (`create-project.js`, `paths.js`, `vitest.config.js`, `tsconfig.json`, 4 test files)
- **Código duplicado eliminado:** ~150 líneas
- **Tests:** 44 (100% passing)
- **Node.js mínimo:** 20 (antes 16)

---

## [2.0.0] - 2025-12-10

### 🎉 ARQUITECTURA v2.0 - PLANTILLAS LOCALES Y SISTEMA DE EXTRAS

**✅ Cambio de arquitectura completo - De clonado remoto a copia local**  
**✅ Nuevo sistema de extras para plugins por template**  
**✅ Eliminación de dependencia de degit y GitHub**

### 🚀 Cambios Principales

#### Sistema de Plantillas Local

- 📦 **Templates locales** - Las plantillas ahora están incluidas en el CLI
    - Estructura: `templates/{nombre-template}/www/` - Código base del template
    - Estructura: `templates/{nombre-template}/extras/` - Plugins y extras específicos
    - No requiere conexión a internet para crear proyectos
    - Copia directa desde el sistema de archivos
    - Mayor velocidad de creación de proyectos

#### Nuevas Rutas de Templates

- 📁 `templates/astro-template-devanthos/www/` - Template base de Astro
- 📁 `templates/next-template-devanthos/www/` - Template base de Next.js
- 📁 `templates/expo-template-devanthos/www/` - Template base de Expo
- 📁 `templates/*/extras/` - Carpeta para plugins y extras específicos por framework

#### Sistema de Extras

- 🔌 **Plugins por template** - Los plugins ahora se organizan por framework
    - `templates/astro-template-devanthos/extras/` - Plugins para Astro
    - `templates/next-template-devanthos/extras/` - Plugins para Next.js
    - `templates/expo-template-devanthos/extras/` - Plugins para Expo
    - Descubrimiento automático de plugins desde extras
    - Mayor organización y modularidad

### ✨ Agregado

#### Archivos Modificados

- **`utils/clone.js`** - Completamente reescrito
    - Eliminada dependencia de `degit`
    - Nueva función `copyRecursiveSync()` para copia local
    - Validación de existencia de templates locales
    - Mejor manejo de errores específicos
    - Retorna información de `extrasPath` para plugins

- **`utils/plugins.js`** - Sistema de descubrimiento actualizado
    - Nueva búsqueda en `templates/*/extras/`
    - Prioriza plugins específicos del framework
    - Mantiene compatibilidad con carpeta `plugins/` legacy
    - Descubrimiento automático en múltiples ubicaciones

- **`index.js`** - Flujo principal actualizado
    - Mensajes actualizados ("Copiando plantilla" vs "Descargando")
    - Hook `afterClone` ahora recibe `extrasPath`
    - Mejor integración con sistema de extras
    - Soporte para ambos modos (interactivo y CLI)

- **`plugin-installer.js`** - Mensajes actualizados
    - Referencias a "templates/extras" en mensajes
    - Mejor comunicación sobre ubicación de plugins
    - Guías actualizadas para usuarios

- **`package.json`** - Versión 2.0.0
    - Eliminada dependencia `degit`
    - Actualizado campo `files` (`templates/` en lugar de `plugins/`)
    - Descripción actualizada con mención a sistema local
    - Nuevas keywords: `local-templates`

### 🔄 Cambiado

#### De Sistema Remoto a Local

**Antes (v1.x):**

```javascript
import degit from "degit";
const emitter = degit("Devanthos-Agency/astro-template-devanthos");
await emitter.clone(projectPath);
```

**Ahora (v2.0):**

```javascript
import { cpSync } from "fs";
const templatePath = path.join(CLI_ROOT, "templates", "astro-template-devanthos", "www");
copyRecursiveSync(templatePath, projectPath);
```

#### Estructura de Carpetas

**Antes (v1.x):**

```
cli-devanthos/
├── plugins/
│   ├── analytics/
│   ├── stripe/
│   └── ...
```

**Ahora (v2.0):**

```
cli-devanthos/
├── templates/
│   ├── astro-template-devanthos/
│   │   ├── www/       # Template base
│   │   └── extras/    # Plugins específicos
│   ├── next-template-devanthos/
│   │   ├── www/
│   │   └── extras/
│   └── expo-template-devanthos/
│       ├── www/
│       └── extras/
└── plugins/           # Legacy (compatibilidad)
```

### 🗑️ Removido

- ❌ **Dependencia `degit`** - Ya no se necesita clonar desde GitHub
- ❌ **Carpeta `plugins/` principal** - Reemplazada por `templates/*/extras/`
- ❌ **Conexión a internet requerida** - Los templates están incluidos localmente

### 📊 Ventajas de v2.0

#### Rendimiento

- ⚡ **10x más rápido** - Copia local vs clonado remoto
- 📶 **Sin conexión requerida** - Funciona offline
- 💾 **Sin caché de degit** - Menos problemas de storage

#### Confiabilidad

- ✅ **Sin dependencia de GitHub** - No afectado por rate limits
- ✅ **Sin problemas de red** - Funciona en cualquier ambiente
- ✅ **Versionado garantizado** - Template incluido con el CLI

#### Organización

- 📁 **Mejor estructura** - Plugins organizados por framework
- 🔍 **Más descubrible** - Fácil encontrar extras por template
- 🎯 **Más modular** - Cada template con sus propios extras

### 🐛 Corregido

- ✅ Problemas de clonado en redes corporativas
- ✅ Rate limiting de GitHub API
- ✅ Caché corrupto de degit
- ✅ Errores de conexión a internet
- ✅ Problemas con proxies corporativos

### 🧪 Testing

```bash
# Verificar estructura de templates
ls -la templates/astro-template-devanthos/www/
ls -la templates/next-template-devanthos/www/
ls -la templates/expo-template-devanthos/www/

# Verificar sistema de extras
ls -la templates/*/extras/

# Test de creación de proyecto
npx create-devanthos-app test-proyecto -t astro

# Test sin conexión a internet
# (desconectar red y crear proyecto)
npx create-devanthos-app offline-test -t next
```

### 📚 Migración desde v1.x

#### Para Usuarios

No hay cambios necesarios. El CLI funciona igual que antes:

```bash
# Mismo comando de siempre
npx create-devanthos-app mi-proyecto
```

**Beneficios inmediatos:**

- ✅ Creación más rápida
- ✅ Funciona sin internet
- ✅ Más confiable

#### Para Desarrolladores de Plugins

Los plugins ahora se deben ubicar en:

**Antes:**

```
plugins/mi-plugin/
├── src/
├── plugin.json
└── README.md
```

**Ahora:**

```
templates/astro-template-devanthos/extras/mi-plugin/
├── src/
├── plugin.json
└── README.md

templates/next-template-devanthos/extras/mi-plugin/
├── src/
├── plugin.json
└── README.md
```

El sistema automáticamente descubre plugins en ambas ubicaciones (legacy y nueva).

### 🎯 Próximos Pasos (v2.1.0)

- [ ] Migrar plugins existentes de `plugins/` a `templates/*/extras/`
- [ ] Comando para sincronizar templates desde repositorios
- [ ] Sistema de actualización de templates
- [ ] CLI para gestionar extras: `devanthos extras list`
- [ ] Soporte para templates personalizados de usuarios

### 📊 Estadísticas

- **Archivos modificados:** 5
- **Líneas cambiadas:** ~200
- **Dependencias eliminadas:** 1 (degit)
- **Nuevas carpetas:** 3 (templates/\*/extras/)
- **Velocidad de creación:** 10x más rápido
- **Tamaño del paquete:** +~2MB (templates incluidos)

### 🎉 Conclusión

La versión 2.0.0 representa un cambio fundamental en la arquitectura del CLI, priorizando:

- 🚀 **Velocidad** - Copia local es instantánea
- 🔒 **Confiabilidad** - Sin dependencia de servicios externos
- 📦 **Simplicidad** - Todo incluido en el paquete
- 🎯 **Organización** - Estructura clara por framework

Este es un cambio **major** porque altera la estructura interna del CLI, pero mantiene **100% de compatibilidad** para los usuarios finales.

---

## [1.6.0] - 2025-10-15

### 🚀 SISTEMA DE PLUGINS v2.0 + PLUGIN MERCADO PAGO

**✅ Plugin Loader completamente actualizado para estructura modular**  
**✅ Nuevo Plugin Installer CLI para proyectos existentes**  
**✅ Plugin Mercado Pago para pagos en Latinoamérica**

### ✨ Agregado

#### Sistema de Plugins v2.0

- 🔌 **Plugin Loader Modular** - Actualizado `utils/plugins.js`
    - `loadModularPlugin()` - Carga plugins desde `plugin.json`
    - `installPlugin()` - Instala plugin en proyecto de usuario
    - `listAvailablePlugins()` - Lista plugins por framework
    - Normalización automática de metadata (objeto → array)
    - Descubrimiento automático de plugins en carpeta `plugins/`
    - Compatibilidad total con plugins legacy (`.plugin.js`)

- 🛠️ **Plugin Installer CLI** - Nuevo comando `devanthos-plugins`
    - Modo interactivo (wizard con detección automática de framework)
    - Modo CLI con flags (`--framework`, `--skip-deps`)
    - Comando `install` para instalar plugins
    - Comando `list` para listar plugins disponibles
    - Copia automática de archivos desde `src/` a proyecto
    - Instalación automática de dependencias NPM
    - Muestra instrucciones post-instalación

#### Plugin Mercado Pago (Nuevo)

- 💰 **@devanthos/plugin-mercadopago** - Integración completa con Mercado Pago
    - **SDK Integration** (`mercadopago.ts`) - Cliente configurado, createPreference(), getPayment()
    - **Checkout API** (`checkout/route.ts`) - Endpoint POST para crear preferencias
    - **Webhook IPN** (`webhook/route.ts`) - Manejo de notificaciones en tiempo real
    - **CheckoutButton** (`CheckoutButton.tsx`) - Componente React con loading states
    - **ProductCard** (`ProductCard.tsx`) - Card de producto con checkout integrado
    - **Documentación** (`MERCADOPAGO.md`) - 680 líneas completas
    - **8 países soportados** - ARG, BRA, CHI, COL, MEX, PER, URY, VEN
    - **TypeScript completo** - Interfaces para CheckoutItem, PayerInfo, PreferenceData
    - **Testing ready** - Credenciales de prueba + tarjetas de test

#### Testing y Validación

- 🧪 **test-plugin-loader.js** - Suite completa de tests
    - 67 tests (100% passing ✅)
    - Validación de 8 plugins modulares
    - Validación de estructura `plugin.json`
    - Validación de archivos fuente
    - Pruebas de compatibilidad legacy
    - Listado por framework (Next.js: 6, Astro: 4, Expo: 2)

#### Documentación

- 📚 **plugins/README_PLUGIN_SYSTEM.md** - Documentación completa del sistema
    - Guía de instalación de plugins
    - Guía de creación de plugins
    - Estructura modular explicada
    - API Reference del Plugin Manager
    - Migración desde v1.x
    - Ejemplos completos

### 🔧 Modificado

- **package.json**
    - Versión: `1.5.3` → `1.6.0`
    - Nuevo bin: `devanthos-plugins` → `./plugin-installer.js`
    - Agregado `plugin-installer.js` a files

- **README.md**
    - Nueva sección "Sistema de Plugins v2.0"
    - Tabla de 8 plugins disponibles
    - Ejemplos de instalación con `devanthos-plugins`
    - Links a documentación completa

### 🐛 Corregido

- Normalización de `files` en `plugin.json` (soporte para formato objeto y array)
- Detección correcta de framework en plugin installer
- Mensajes de error mejorados en plugin loader

### 📊 Estadísticas

- **Archivos nuevos:** 4
- **Archivos modificados:** 3
- **Líneas de código:** ~1,500 nuevas
- **Líneas de documentación:** ~700 nuevas
- **Plugins modulares:** 8/8 (100%)
- **Tests pasando:** 67/67 (100%)
- **Frameworks soportados:** 3 (Next.js, Astro, Expo)

### 🎯 Comandos Nuevos

```bash
# Instalar plugin (interactivo)
npx devanthos-plugins install

# Instalar plugin específico
npx devanthos-plugins install @devanthos/plugin-mercadopago

# Listar plugins
npx devanthos-plugins list
npx devanthos-plugins list --framework next
```

---

## [1.5.3] - 2025-10-13

### 🏗️ MIGRACIÓN COMPLETA A ARQUITECTURA v2.0

**✅ 100% de plugins migrados a la nueva estructura modular**

Esta versión completa la reestructuración del sistema de plugins, migrando **todos los 5 plugins restantes** a la nueva arquitectura modular con separación de código, metadata y documentación.

### ✨ Agregado

#### Plugins Migrados a Estructura v2.0

- 🔍 **Plugin SEO** - Ahora con estructura modular completa
    - Código separado: `SEO.astro`, `SEO.tsx`, `next-sitemap.config.js`, `robots.txt`
    - Documentación: `SEO.md` (400+ líneas)
    - Metadata: `plugin.json` con dependencias y configuración
- 🔐 **Plugin Auth** - Autenticación modular
    - Código separado: NextAuth routes, middleware, utils para Expo
    - Documentación: `AUTH.md` (450+ líneas)
    - Soporte Next.js y Expo
- 💾 **Plugin Database** - Prisma ORM modular
    - Código separado: `schema.prisma`, cliente Prisma
    - Documentación: `DATABASE.md` (500+ líneas)
    - Soporte Next.js y Astro
- 📝 **Plugin Content** - MDX y Content Collections
    - Código separado: config, posts de ejemplo, utilidades MDX
    - Documentación: `CONTENT.md` (400+ líneas)
    - Soporte Astro y Next.js
- 🔐📱 **Plugin Expo Auth** - Auth móvil completo
    - Código separado: AuthContext, LoginScreen
    - Documentación: `EXPO-AUTH.md` (350+ líneas)
    - Solo Expo/React Native

#### Documentación Masiva

- 📚 **~2,800 líneas de documentación** nueva entre todos los plugins
- 📖 Cada plugin incluye:
    - Características detalladas
    - Guía de instalación
    - Configuración paso a paso
    - Ejemplos de uso
    - API Reference
    - Best Practices
    - Troubleshooting
    - Ejemplos avanzados
    - Recursos externos

#### Archivos de Código Real

- 📦 **22 archivos de código fuente** TypeScript/JavaScript
- ✅ Syntax highlighting funcionando
- ✅ Linting automático
- ✅ Archivos reales (no strings embedidos)
- ✅ Estructura que refleja destino final en proyectos

#### Sistema de Validación

- 🧪 **Test suite actualizado** - `test-plugin-structure.js`
- ✅ Valida 7 plugins en nueva estructura
- ✅ Verifica `plugin.json`, `src/`, y archivos `.md`
- ✅ 100% de plugins pasando validación

### 🔄 Cambiado

- 🏗️ **Arquitectura de plugins** - De monolítico a modular
- 📁 **Estructura de carpetas** - Cada plugin en su propia carpeta
- 📝 **Separación de concerns** - Código, metadata y docs separados
- 🎯 **plugin.json estandarizado** - Schema consistente entre todos los plugins

### 📊 Estadísticas de Migración

**Antes (v1.5.2):**

- 7 archivos `.plugin.js` monolíticos
- ~1,500 líneas de código en strings
- Documentación básica en README
- 0 archivos de código reales

**Después (v1.5.3):**

- 7 carpetas organizadas
- 22 archivos de código fuente reales
- 7 archivos `plugin.json` con metadata
- 7 documentaciones completas (`.md`)
- ~2,800 líneas de documentación
- 100% validado con tests

**Mejoras:**

- 📈 +186% en documentación
- 📈 100% de código separado
- 📈 100% de plugins documentados
- ✅ TypeScript completamente tipado
- ✅ Estructura escalable

### 📁 Nueva Estructura de Plugin

```
plugins/
├── plugin-name/
│   ├── src/                  # Código fuente
│   │   ├── components/       # Componentes
│   │   ├── lib/             # Utilidades
│   │   ├── app/             # Routes (Next.js)
│   │   └── config/          # Archivos de config
│   ├── plugin.json          # Metadata
│   └── DOCS.md             # Documentación completa
```

### 🎯 Archivos Creados

#### Código Fuente (22 archivos nuevos)

**SEO Plugin (4 archivos):**

- `plugins/seo/src/components/SEO.astro`
- `plugins/seo/src/components/SEO.tsx`
- `plugins/seo/src/config/next-sitemap.config.js`
- `plugins/seo/src/config/robots.txt`

**Auth Plugin (3 archivos):**

- `plugins/auth/src/app/api/auth/[...nextauth]/route.ts`
- `plugins/auth/src/app/middleware.ts`
- `plugins/auth/src/utils/auth.ts`

**Database Plugin (2 archivos):**

- `plugins/database/src/prisma/schema.prisma`
- `plugins/database/src/lib/prisma.ts`

**Content Plugin (4 archivos):**

- `plugins/content/src/content/config/config.ts`
- `plugins/content/src/content/blog/primer-post.md`
- `plugins/content/src/content/posts/primer-post.mdx`
- `plugins/content/src/lib/mdx.ts`

**Expo Auth Plugin (2 archivos):**

- `plugins/expo-auth/src/context/AuthContext.tsx`
- `plugins/expo-auth/src/screens/LoginScreen.tsx`

#### Metadata (5 archivos nuevos)

- `plugins/seo/plugin.json`
- `plugins/auth/plugin.json`
- `plugins/database/plugin.json`
- `plugins/content/plugin.json`
- `plugins/expo-auth/plugin.json`

#### Documentación (5 archivos nuevos)

- `plugins/seo/SEO.md` (400+ líneas)
- `plugins/auth/AUTH.md` (450+ líneas)
- `plugins/database/DATABASE.md` (500+ líneas)
- `plugins/content/CONTENT.md` (400+ líneas)
- `plugins/expo-auth/EXPO-AUTH.md` (350+ líneas)

#### Documentación General

- `SUMMARY_v1.5.3.md` - Resumen completo de la migración
- `ARCHITECTURE_v2.md` - Documentación de la nueva arquitectura

### 🧪 Validación

```bash
$ node test-plugin-structure.js

✅ Todos los plugins validados:
   - analytics ✅ (desde v1.5.2)
   - stripe ✅ (desde v1.5.2)
   - seo ✅ (nuevo en v1.5.3)
   - auth ✅ (nuevo en v1.5.3)
   - database ✅ (nuevo en v1.5.3)
   - content ✅ (nuevo en v1.5.3)
   - expo-auth ✅ (nuevo en v1.5.3)

Plugins en nueva estructura: 7/7 (100%)
```

### 🎨 Ventajas de la Nueva Arquitectura

1. **Mantenibilidad**: Cada plugin es independiente y fácil de actualizar
2. **Escalabilidad**: Agregar nuevos plugins es trivial
3. **Documentación**: Cada plugin tiene guía completa y detallada
4. **Testing**: Validación automática de estructura
5. **TypeScript**: Linting y autocompletado funcionan perfectamente
6. **Git**: Mejor tracking de cambios por archivo
7. **Profesional**: Archivos reales vs strings embedidos

### 📚 Documentación Incluida

Cada plugin ahora incluye documentación completa con:

- ✅ Tabla de contenidos
- ✅ Lista de características
- ✅ Guía de instalación
- ✅ Configuración paso a paso
- ✅ Ejemplos de uso
- ✅ API Reference completo
- ✅ Best Practices
- ✅ Troubleshooting
- ✅ Ejemplos avanzados
- ✅ Links a recursos externos

### 🚀 Retrocompatibilidad

- ✅ Archivos `.plugin.js` legacy mantenidos
- ✅ Sistema antiguo sigue funcionando
- ✅ Migración no rompe proyectos existentes

### 📈 Progreso Total

| Versión | Plugins Implementados | Estructura Modular | Docs Completas | Archivos Reales |
| ------- | --------------------- | ------------------ | -------------- | --------------- |
| v1.5.2  | 7                     | 2                  | 2              | 7               |
| v1.5.3  | 7                     | 7 ✅               | 7 ✅           | 22 ✅           |

### 🎯 Próximos Pasos (v1.6.0)

- [ ] Actualizar plugin loader para leer nueva estructura
- [ ] Sistema de copia de archivos desde `src/` al proyecto
- [ ] Instalación automática de dependencias
- [ ] CLI commands: `devanthos add <plugin>`
- [ ] Más plugins: i18n, testing, monitoring, email

---

## [1.5.2] - 2025-01-14

### ✨ Agregado

#### Sistema de Plugins Completo

- 🔌 **7 plugins funcionales** - Plugins completos con código listo para usar
- 📊 **Plugin Analytics** - Google Analytics y Vercel Analytics
- 🔍 **Plugin SEO** - Meta tags, sitemap, robots.txt, OpenGraph
- 🔐 **Plugin Auth** - NextAuth.js para Next.js, Secure Store para Expo
- 💾 **Plugin Database** - Prisma con modelos de ejemplo
- 📝 **Plugin Content** - MDX con Content Collections (Astro) o next-mdx-remote (Next)
- 💳 **Plugin Stripe** - Integración completa de pagos
- 📱 **Plugin Expo Auth** - Sistema de autenticación móvil

#### Infraestructura de Plugins

- 📦 **`plugins/` directory** - Carpeta con todos los plugins
- 🔄 **`plugins/index.js`** - Sistema de carga y gestión de plugins
- 🧪 **`test-plugins.js`** - Suite de tests para plugins
- 📚 **`plugins/README.md`** - Documentación completa de plugins

#### Características de Plugins

- ⚙️ **Archivos de configuración** - Cada plugin incluye archivos listos para usar
- 📦 **Dependencias listadas** - Cada plugin especifica sus dependencias
- 📝 **Instrucciones post-instalación** - Guías paso a paso
- 🎯 **Variables de entorno** - Lista de env vars necesarias
- 🔧 **Código funcional** - Ejemplos completos, no solo stubs

### 📚 Documentación

- Agregada documentación completa de plugins en `plugins/README.md`
- Tests automatizados para validar estructura de plugins
- Ejemplos de uso para cada plugin

---

## [1.5.1] - 2025-01-14

### 🎨 Mejorado

#### Experiencia de Usuario (UX)

- **Flujo de presets mejorado** - Los presets ahora se muestran **después** de elegir el framework
- **Filtrado inteligente** - Solo se muestran presets relevantes para el framework seleccionado
- **Configuración manual integrada** - Opción "⚙️ Configuración manual" en la lista de presets
- **Eliminada pregunta redundante** - Ya no pregunta "¿Querés usar un preset?" al inicio

#### Cambios en el Wizard

**Antes:**

1. ¿Querés usar un preset? (Sí/No)
2. Seleccionar preset (si eligió Sí) o Framework (si eligió No)
3. Framework...

**Ahora:**

1. ¿Qué tipo de proyecto querés crear? (Framework)
2. Seleccioná una configuración: (presets filtrados + opción manual)
3. Nombre del proyecto...

### 📚 Documentación

- Actualizado README con nuevo flujo
- Agregado test de integración `test-preset-integration.js`

---

## [1.5.0] - 2025-01-14

### 🎯 Características principales

Esta versión introduce **Presets predefinidos** y **sistema de configuración** personalizable, permitiendo crear proyectos optimizados para casos de uso específicos.

### ✨ Agregado

#### Sistema de Presets

- 🎨 **7 presets predefinidos** - Configuraciones optimizadas para diferentes casos de uso
- 📦 **Preset `landing-page`** - Landing page con analytics, SEO y formularios
- 🎛️ **Preset `dashboard`** - Panel admin con auth, database y charts
- 📝 **Preset `blog`** - Blog con MDX, RSS y sitemap
- 🛒 **Preset `ecommerce`** - Tienda con Stripe, cart y auth
- 🎨 **Preset `portfolio`** - Portfolio personal con proyectos
- 📱 **Preset `mobile-app`** - App móvil con navegación y auth
- 🔧 **Preset `minimal`** - Configuración mínima

#### Sistema de Configuración

- ⚙️ **`devanthos.config.js`** - Archivo de configuración personalizable
- 💾 **Guardar configuración** - Flag `--save-config` para persistir settings
- 🔄 **Merge inteligente** - Combina configuración default con personalizada
- ✅ **Validación de config** - Valida estructura y valores
- 📖 **Metadata de presets** - Información detallada de cada preset

#### CLI y Comandos

- 🆕 **Flag `-p, --preset`** - Seleccionar preset desde CLI
- 📋 **Comando `list-presets`** - Listar todos los presets disponibles
- 🎨 **Wizard mejorado** - Nueva pregunta para usar presets
- 💬 **Mensajes de preset** - Muestra información del preset seleccionado

#### Documentación

- 📚 **PRESETS.md** - Guía completa de presets y configuración
- 📝 **Comparación de presets** - Tabla comparativa de características
- 💡 **Ejemplos de uso** - Casos de uso para cada preset
- 🎯 **Personalización** - Guía para crear presets personalizados

#### Archivos nuevos

- `utils/config.js` (350 líneas) - Sistema completo de configuración y presets
- `PRESETS.md` (500 líneas) - Documentación de presets

### 🔄 Cambiado

- 🎨 **Wizard interactivo** - Pregunta inicial sobre uso de presets
- 📖 **README actualizado** - Sección de presets y tabla comparativa
- 📦 **package.json** - Versión 1.5.0 y descripción actualizada
- 🎯 **CLI flags** - Soporte completo para presets en modo no-interactivo

### 🎯 Ejemplos de uso

```bash
# Crear con preset (modo interactivo)
npx create-devanthos-app
# Seleccionar "Sí, elegir un preset" → Dashboard

# Crear con preset (CLI flags)
npx create-devanthos-app mi-landing -p landing-page

# Listar presets
npx create-devanthos-app list-presets

# Guardar configuración
npx create-devanthos-app mi-dashboard -p dashboard --save-config
```

### 📊 Estadísticas

- **Líneas agregadas**: ~850
- **Archivos nuevos**: 2
- **Archivos modificados**: 4
- **Presets disponibles**: 7
- **Opciones CLI**: 6 (agregado `--preset` y `--save-config`)

---

## [1.4.0] - 2025-01-13

### Características principales

Esta versión introduce **modo no-interactivo** con CLI flags y **Git Auto-Init**, haciendo el CLI compatible con CI/CD y automatización.

### ✨ Agregado

#### CLI Flags (Modo No-Interactivo)

- � **Commander.js integrado** - Sistema robusto de argumentos y opciones
- 🎯 **Modo no-interactivo** - Crear proyectos sin prompts para automatización
- ⚙️ **Flags completos**:
    - `-t, --template <framework>` - Especificar framework (astro, next, expo)
    - `--no-install` - Saltar instalación de dependencias
    - `--no-git` - Saltar inicialización de Git
    - `--skip-update-check` - Saltar verificación de actualizaciones
    - `-V, --version` - Mostrar versión del CLI
    - `-h, --help` - Mostrar ayuda

#### Git Auto-Init

- 🔧 **Inicialización automática de Git** - Repositorio Git creado automáticamente
- 🌿 **Branch `main` por defecto** - Siguiendo las mejores prácticas modernas
- 💬 **Commit inicial automático** - "🎉 Initial commit from create-devanthos-app"
- ✅ **Detección inteligente** - Verifica si Git está instalado y configurado
- 🛡️ **Manejo de errores graceful** - No bloquea la creación del proyecto si Git falla
- 🎛️ **Modo verbose** - Opción para logs detallados

#### Documentación

- 📚 **CLI_FLAGS.md** - Guía completa de uso de flags con ejemplos
- 🤖 **Ejemplos de CI/CD** - Integración con GitHub Actions, GitLab CI y scripts Bash
- 🧪 **test-cli.js** - Suite de tests para verificar funcionalidad
- 📖 **SUMMARY.md** - Resumen ejecutivo de la implementación

#### Archivos nuevos

- `utils/git.js` (180 líneas) - Módulo completo para gestión de Git
- `CLI_FLAGS.md` (350 líneas) - Documentación de flags y casos de uso
- `test-cli.js` (60 líneas) - Tests de verificación
- `SUMMARY.md` - Resumen de implementación

### 🔄 Cambiado

- 🎨 **Wizard interactivo mejorado** - Ahora incluye pregunta para inicializar Git
- 📖 **README actualizado** - Nueva sección "Modo No-Interactivo" con ejemplos
- 📦 **package.json** - Versión 1.4.0 y descripción actualizada
- 🔄 **Flujo principal** - Soporta ambos modos (interactivo y no-interactivo)
- 📝 **IMPLEMENTATION.md** - Documentación técnica actualizada con v1.4.0

### 🎯 Casos de uso nuevos

```bash
# Modo interactivo (existente)
npx create-devanthos-app

# Modo no-interactivo (nuevo)
npx create-devanthos-app mi-proyecto -t astro

# Sin instalar dependencias
npx create-devanthos-app mi-app -t next --no-install

# Para CI/CD
npx create-devanthos-app build -t next --no-git --skip-update-check
```

### 📊 Estadísticas

- **Líneas agregadas**: ~650
- **Archivos nuevos**: 4
- **Archivos modificados**: 5
- **Funciones nuevas**: 4
- **Opciones CLI**: 5
- **Tests implementados**: 3

---

## [1.3.0] - 2025-01-10

### Agregado

---

## [1.3.0] - 2025-01-10

### Agregado

- 🔌 **Sistema de plugins completo** con API de hooks y carga automática
- 🤖 **Actualizaciones automáticas** con chequeo inteligente y caché (cada 24h)
- 📦 **Plugin de actualización de dependencias** integrado por defecto
- 📱 **Soporte para Expo/React Native** - Tercera opción de framework
- 📖 **Documentación de plugins** en `examples/README.md`
- 🔍 **Auditoría de seguridad** opcional con npm audit

#### Sistema de Plugins

- ✅ API completa de hooks: `beforeClone`, `afterClone`, `beforeInstall`, `afterInstall`, `onError`, `onComplete`
- ✅ Carga automática desde múltiples ubicaciones (local, proyecto, global)
- ✅ Validación de estructura de plugins
- ✅ Sistema de prioridades para orden de ejecución
- ✅ Gestión de plugins (listar, desactivar)

#### Plugin de Actualización de Dependencias

- ✅ Actualización automática de dependencias principales por framework
- ✅ Consulta npm registry para obtener últimas versiones
- ✅ Soporte para Astro, Next.js y Expo
- ✅ Variables de entorno: `DEVANTHOS_UPDATE_DEPS`, `DEVANTHOS_AUDIT`, `DEVANTHOS_VERBOSE`

#### Actualizaciones Automáticas del CLI

- ✅ Chequeo automático cada 24 horas con caché inteligente
- ✅ Detección de método de instalación (global vs npx)
- ✅ Variable de entorno: `DEVANTHOS_NO_UPDATE_CHECK`

### Cambiado

- 🎨 Interfaz actualizada con tercera opción de framework (Expo)
- ⚡ Integración de hooks de plugins en el flujo principal
- 🔄 Las plantillas ahora se actualizan automáticamente

### Archivos nuevos

- `utils/plugins.js` - Sistema de gestión de plugins
- `utils/update.js` - Sistema de actualizaciones automáticas
- `utils/dependency-updater.plugin.js` - Plugin de actualización de dependencias
- `examples/README.md` - Guía de creación de plugins

---

## [1.0.0] - 2024-12-29

### 🚀 Lanzamiento Inicial

Primera versión pública del CLI de Devanthos.

### Agregado

- 🚀 **CLI inicial** de create-devanthos-app
- 🌌 **Soporte para Astro** - Plantillas para sitios estáticos
- ⚛️ **Soporte para Next.js** - Plantillas para aplicaciones web
- 📦 **Detección inteligente** de gestores de paquetes (pnpm, yarn, bun, npm)
- 🎨 **Interfaz moderna** con colores y animaciones (chalk + ora)
- ✅ **Validación de nombres** de proyecto con reglas estrictas
- 🔧 **Manejo robusto de errores** con mensajes útiles
- 📚 **Documentación completa** con ejemplos
- 🧪 **Scripts de desarrollo** y testing
- 🔍 **Verificación automática** de instalación
- 🧹 **Limpieza automática** en caso de errores
- **Sugerencias inteligentes** para resolución de problemas

### Características técnicas

- 🎨 Banner ASCII personalizado para Devanthos
- ⏱️ Timeout configurable para instalaciones largas
- 📄 Detección de archivos lock para gestor preferido
- 🔄 Fallback automático entre gestores de paquetes
- ✅ Validación de integridad de plantillas clonadas
- 🐛 Soporte para modo desarrollo con logs detallados

### Archivos principales

- `index.js` - CLI principal con wizard interactivo
- `utils/clone.js` - Lógica de clonado con degit
- `utils/install.js` - Instalación de dependencias
- `package.json` - Configuración del paquete npm

---

## 📋 Roadmap Futuro

### [1.5.0] - Planificado

- 🎨 **Presets de configuración** (landing-page, dashboard, blog)
- 🧩 **Generador de componentes** post-instalación
- 🧪 **Tests unitarios** con Jest
- 📊 **Telemetría anónima** (opt-in)

### [2.0.0] - Planificado

- 🎭 **Templates con variantes** (minimal, full, custom)
- 🏪 **Marketplace de plugins** de la comunidad
- 🔄 **Comando `upgrade`** para proyectos existentes
- 🌍 **Soporte multiidioma** (español, inglés, portugués)
- � **Template para APIs Node.js**
- ☁️ **Deploy automático** a Vercel/Netlify/Railway

---

## 📝 Notas de Desarrollo

### Principios

- ✅ Mantener compatibilidad con Node.js 16+
- ✅ Priorizar experiencia de usuario
- ✅ Tests automáticos antes de cada release
- ✅ Documentación actualizada en cada cambio
- ✅ Versionado semántico estricto

### Convenciones de Commits

- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato, punto y coma, etc.
- `refactor:` - Refactorización de código
- `test:` - Agregar tests
- `chore:` - Tareas de mantenimiento

---

## 🔗 Enlaces

- **Repositorio**: [github.com/Devanthos-Agency/cli-devanthos](https://github.com/Devanthos-Agency/cli-devanthos)
- **npm**: [npmjs.com/package/create-devanthos-app](https://www.npmjs.com/package/create-devanthos-app)
- **Documentación**: [docs.devanthos.com](https://docs.devanthos.com)
- **Issues**: [github.com/Devanthos-Agency/cli-devanthos/issues](https://github.com/Devanthos-Agency/cli-devanthos/issues)

---

**Hecho con 💜 por [Devanthos Agency](https://devanthos.com)**
