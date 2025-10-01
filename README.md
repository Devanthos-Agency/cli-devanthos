# 🚀 create-devanthos-app

<div align="center">

![Devanthos CLI](https://img.shields.io/badge/Devanthos-CLI-magenta?style=for-the-badge)
![npm version](https://img.shields.io/npm/v/create-devanthos-app?style=for-the-badge&color=green)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**CLI oficial de Devanthos para crear proyectos modernos con Astro, Next.js y Expo**

_Plantillas profesionales, optimizadas y listas para producción_ ✨

</div>

---

## 🌟 Características

- 🎯 **Plantillas optimizadas** - Configuraciones profesionales para Astro y Next.js
- 🚀 **Instalación rápida** - Un comando para crear tu proyecto completo
- 📦 **Gestores inteligentes** - Detección automática de pnpm, yarn, bun o npm
- 🎨 **Experiencia premium** - Interfaz moderna con colores y animaciones
- 🔧 **Configuración completa** - TypeScript, Tailwind CSS, ESLint y más
- 📱 **Responsive ready** - Diseños adaptativos desde el primer día

---

## 🚀 Uso rápido

```bash
# Crear un nuevo proyecto (recomendado)
npx create-devanthos-app

# O con npm
npm create devanthos-app

# O con pnpm (recomendado)
pnpm create devanthos-app
```

El asistente te guiará paso a paso:

1. **Selecciona el framework** (Astro, Next.js o Expo)
2. **Nombra tu proyecto**
3. **Confirma instalación automática**
4. **¡Listo!** 🎉

---

## 🎯 Plantillas disponibles

### 🌌 Astro Template

**Ideal para:** Sitios estáticos, landing pages, blogs, documentación

**Incluye:**

- ⚡ Astro 4.0+ con renderizado híbrido
- 🎨 Tailwind CSS + componentes prediseñados
- 📝 TypeScript configurado
- 🔍 SEO optimizado + Meta tags
- 📱 PWA ready
- 🌙 Modo oscuro incluido
- 📊 Analytics preparado

### ⚛️ Next.js Template

**Ideal para:** Aplicaciones web, dashboards, SaaS, e-commerce

**Incluye:**

- 🚀 Next.js 14 + App Router
- 🎨 Tailwind CSS + Shadcn/ui
- 📝 TypeScript estricto
- 🔐 Autenticación preparada
- 🗃️ Base de datos (Prisma + SQLite)
- 🧪 Testing (Jest + React Testing Library)
- 📊 Métricas y Analytics

### 📱 Expo Template

**Ideal para:** Aplicaciones móviles, apps nativas, MVP rápidos

**Incluye:**

- 🚀 Expo SDK 50+ con EAS Build
- 🎨 NativeWind (Tailwind para React Native)
- 📝 TypeScript configurado
- 🧭 Navegación (React Navigation)
- 🔍 Estado global (Zustand)
- 📷 Cámara y multimedia listos
- 📦 Publicación automática (EAS)

---

## 📖 Guía paso a paso

### 1. Ejecutar el CLI

```bash
npx create-devanthos-app
```

### 2. Seleccionar plantilla

```
¿Qué tipo de proyecto querés crear?
❯ 🌌 Astro - Sitios estáticos y landing pages ultra rápidas
  ⚛️ Next.js - Aplicaciones dinámicas, dashboards y SaaS
  📱 Expo - Aplicaciones móviles con React Native
```

### 3. Nombrar el proyecto

```
¿Cuál será el nombre de tu proyecto? mi-proyecto-devanthos
```

### 4. Confirmar instalación

```
¿Querés instalar las dependencias automáticamente? (Y/n)
```

### 5. ¡Proyecto creado!

```bash
cd mi-proyecto-devanthos
npm run dev
```

---

## 💡 Ejemplos de uso

### Crear proyecto Astro para landing page

```bash
npx create-devanthos-app
# Selecciona: 🌌 Astro
# Nombre: landing-empresa
# ✅ El proyecto estará en ./landing-empresa
```

### Crear aplicación Next.js para dashboard

```bash
npx create-devanthos-app
# Selecciona: ⚛️ Next.js
# Nombre: admin-dashboard
# ✅ El proyecto estará en ./admin-dashboard
```

---

## 🔧 Configuración avanzada

### Variables de entorno

```bash
# Modo desarrollo (más logs)
NODE_ENV=development npx create-devanthos-app

# Desactivar actualización automática del CLI
export DEVANTHOS_NO_UPDATE_CHECK=true

# Desactivar actualización de dependencias
export DEVANTHOS_UPDATE_DEPS=false

# Habilitar auditoría de seguridad
export DEVANTHOS_AUDIT=true

# Modo verbose (mostrar detalles)
export DEVANTHOS_VERBOSE=true
```

### Gestores de paquetes

El CLI detecta automáticamente el mejor gestor disponible:

1. **pnpm** (recomendado) - Más rápido y eficiente
2. **yarn** - Alternativa robusta
3. **bun** - El más rápido (experimental)
4. **npm** - Estándar de Node.js

---

## � Sistema de Plugins

Devanthos CLI incluye un **sistema de plugins extensible** que te permite personalizar el comportamiento del CLI.

### Plugin Integrado: Actualización de Dependencias

**🎯 Funcionalidad principal:**

- ✅ Actualiza automáticamente las dependencias a las últimas versiones
- ✅ Consulta npm registry en tiempo real
- ✅ Soporta Astro, Next.js y Expo
- ✅ Actualiza tanto `dependencies` como `devDependencies`
- ✅ Preserva compatibilidad con prefijo `^`
- ✅ Auditoría de seguridad opcional

**Variables de control:**

```bash
# Desactivar actualizaciones (default: true)
export DEVANTHOS_UPDATE_DEPS=false

# Habilitar auditoría de seguridad (default: false)
export DEVANTHOS_AUDIT=true

# Mostrar detalles de actualizaciones (default: false)
export DEVANTHOS_VERBOSE=true
```

### Crear tu propio plugin

Crea un archivo `mi-plugin.plugin.js`:

```javascript
export default {
    name: "mi-plugin",
    version: "1.0.0",
    description: "Mi plugin personalizado",

    async afterClone(context) {
        console.log(`Proyecto ${context.projectName} clonado!`);
        return context;
    }
};
```

### Ubicaciones de plugins

Los plugins se cargan automáticamente desde:

1. `./devanthos.plugins.js` (directorio actual)
2. `./.devanthos/plugins/` (proyecto)
3. `~/.devanthos/plugins/` (global/usuario)

📚 **Ver ejemplos completos:** [examples/README.md](./examples/README.md)

---

## 🤖 Actualizaciones Automáticas

El CLI chequea automáticamente cada **24 horas** si hay una nueva versión disponible.

### Características

- ✅ Chequeo automático no bloqueante
- ✅ Caché inteligente (evita saturar npm)
- ✅ Detección de método de instalación
- ✅ Mensajes personalizados según instalación

### Desactivar chequeos

```bash
export DEVANTHOS_NO_UPDATE_CHECK=true
npx create-devanthos-app
```

### Actualizar manualmente

**Si instalaste globalmente:**

```bash
npm install -g create-devanthos-app@latest
```

**Si usas npx:**

```bash
npx create-devanthos-app@latest
# Ya siempre usa la última versión
```

---

## �🛠️ Desarrollo y contribución

### Clonar el repositorio

```bash
git clone https://github.com/devanthos/create-devanthos-app.git
cd create-devanthos-app
npm install
```

### Probar localmente

```bash
npm run dev
# o
npm test
```

### Estructura del proyecto

```
create-devanthos-app/
├── index.js           # CLI principal
├── utils/
│   ├── clone.js       # Lógica de clonado
│   └── install.js     # Instalación de dependencias
├── package.json       # Configuración del paquete
└── README.md         # Esta documentación
```

### Contribuir

1. Fork del repositorio
2. Crea una branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 🆘 Troubleshooting

### Error: "Framework no soportado"

```bash
# Verifica que seleccionaste 'astro' o 'next'
# Si persiste, actualiza el CLI:
npm install -g create-devanthos-app@latest
```

### Error de permisos

```bash
# En Windows (PowerShell como administrador):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

# En macOS/Linux:
sudo npm cache clean --force
```

### Instalación de dependencias falla

```bash
# Instalación manual:
cd tu-proyecto
rm -rf node_modules package-lock.json
npm install
```

### Proyecto no se crea

```bash
# Verifica conexión a internet
# Intenta con --verbose para más detalles:
npx create-devanthos-app --verbose
```

---

## 📚 Recursos adicionales

- 🌐 **Documentación:** [docs.devanthos.com](https://docs.devanthos.com)
- 💬 **Discord:** [discord.gg/devanthos](https://discord.gg/devanthos)
- 🐛 **Issues:** [GitHub Issues](https://github.com/devanthos/create-devanthos-app/issues)
- 📧 **Email:** hola@devanthos.com

---

## 🎨 Próximas funcionalidades

- [ ] 📱 Template React Native
- [ ] 🟢 Template Node.js/Express API
- [ ] 🎨 Más temas y variantes
- [ ] 🔌 Plugins y extensiones
- [ ] 🌍 Soporte multiidioma
- [ ] ☁️ Deploy automático

---

## 📄 Licencia

MIT © [Devanthos](https://devanthos.com)

---

<div align="center">

**¿Te gusta create-devanthos-app?** ⭐ ¡Dale una estrella en GitHub!

**¿Necesitas ayuda?** 💬 [Únete a nuestro Discord](https://discord.gg/devanthos)

---

Hecho con 💜 por el equipo de [Devanthos](https://devanthos.com)

</div>
