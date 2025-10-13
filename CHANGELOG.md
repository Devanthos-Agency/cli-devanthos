# Changelog

Todos los cambios importantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

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
