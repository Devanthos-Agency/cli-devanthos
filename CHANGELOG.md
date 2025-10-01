# Changelog

Todos los cambios importantes de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

## [Sin liberar]

### Agregado

- � **Sistema de plugins completo** con API de hooks y carga automática
- 🤖 **Actualizaciones automáticas** con chequeo inteligente y caché (cada 24h)
- 📦 **Plugin de actualización de dependencias** integrado por defecto
- �📱 Soporte para plantillas de Expo/React Native
- 🚀 Nueva opción de framework móvil en el CLI
- 📖 Documentación completa de plugins con ejemplos
- 🏷️ Keywords relacionadas con desarrollo móvil
- 🔍 Auditoría de seguridad opcional con npm audit
- 📚 Carpeta `examples/` con guías de creación de plugins

### Cambiado

- 🎨 Interfaz actualizada con tercera opción de framework
- 📋 Mensajes mejorados para incluir Expo en descripciones
- ⚡ Integración de hooks de plugins en el flujo principal del CLI
- 🔄 Las plantillas ahora se actualizan automáticamente a las últimas versiones

### Nuevo - Sistema de Plugins

- ✅ API completa de hooks (`beforeClone`, `afterClone`, `beforeInstall`, `afterInstall`, `onError`, `onComplete`)
- ✅ Carga automática desde múltiples ubicaciones
- ✅ Validación de estructura de plugins
- ✅ Sistema de prioridades para orden de ejecución
- ✅ Gestión de plugins (listar, desactivar)
- ✅ Soporte para plugins locales, de proyecto y globales

### Nuevo - Plugin de Actualización de Dependencias

- ✅ Actualización automática de dependencias principales por framework
- ✅ Consulta npm registry para obtener últimas versiones
- ✅ Soporte para Astro, Next.js y Expo
- ✅ Actualiza dependencies y devDependencies
- ✅ Muestra resumen detallado de actualizaciones
- ✅ Variables de entorno para control (`DEVANTHOS_UPDATE_DEPS`, `DEVANTHOS_AUDIT`, `DEVANTHOS_VERBOSE`)

### Nuevo - Actualizaciones Automáticas del CLI

- ✅ Chequeo automático cada 24 horas
- ✅ Caché inteligente para no saturar npm registry
- ✅ Detección de método de instalación (global vs npx)
- ✅ Mensajes personalizados según método de instalación
- ✅ Comando manual para forzar chequeo
- ✅ Variable de entorno para desactivar (`DEVANTHOS_NO_UPDATE_CHECK`)

### Deprecado

- Funcionalidades que serán removidas pronto

### Removido

- Funcionalidades removidas

### Arreglado

- Corrección de bugs

### Seguridad

- Cambios relacionados con seguridad

## [1.0.0] - 2024-12-29

### Agregado

- 🚀 CLI inicial de create-devanthos-app
- 🌌 Soporte para plantillas de Astro
- ⚛️ Soporte para plantillas de Next.js
- 📦 Detección inteligente de gestores de paquetes (pnpm, yarn, bun, npm)
- 🎨 Interfaz moderna con colores y animaciones
- ✅ Validación de nombres de proyecto
- 🔧 Manejo robusto de errores con mensajes útiles
- 📚 Documentación completa con ejemplos
- 🧪 Scripts de desarrollo y testing
- 🔍 Verificación automática de instalación
- 🧹 Limpieza automática en caso de errores
- 📊 Estadísticas de instalación
- 💡 Sugerencias inteligentes para resolución de problemas

### Características técnicas

- Banner ASCII personalizado para Devanthos
- Timeout configurable para instalaciones largas
- Detección de archivos lock para gestor preferido
- Fallback automático entre gestores de paquetes
- Validación de integridad de plantillas clonadas
- Soporte para modo desarrollo con logs detallados

---

## Próximas versiones

### [1.1.0] - Planificado

- 📱 Soporte para React Native
- 🟢 Template para APIs Node.js
- 🎨 Más variantes de temas
- 🌍 Soporte multiidioma

### [1.2.0] - Planificado

- 🔌 Sistema de plugins
- ☁️ Deploy automático
- 📈 Métricas de uso
- 🤖 Actualizaciones automáticas

---

## Notas de desarrollo

- Mantener compatibilidad con Node.js 16+
- Priorizar experiencia de usuario
- Tests automáticos antes de cada release
- Documentación actualizada en cada cambio
