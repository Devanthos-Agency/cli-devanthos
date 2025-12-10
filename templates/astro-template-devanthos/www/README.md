# 🚀 Astro Template Devanthos

Una plantilla moderna y minimalista de Astro con Tailwind CSS, componentes UI reutilizables y configuración lista para producción.

## ✨ Características

- **🏗️ Astro 5** - Framework web moderno y rápido
- **🎨 Tailwind CSS** - CSS utilitario para diseño responsivo
- **⚛️ React** - Componentes interactivos cuando los necesites
- **🧩 shadcn/ui** - Componentes UI elegantes y accesibles
- **📱 Responsive** - Diseño adaptativo para todos los dispositivos
- **🌙 Dark Mode** - Soporte para modo oscuro incluido
- **⚡ Lucide Icons** - Iconografía moderna y consistente
- **📦 TypeScript** - Tipado estático para mayor confiabilidad

## 🏁 Inicio Rápido

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **pnpm** (recomendado) o npm

### Instalación

1. **Clona o descarga** este template
2. **Instala las dependencias:**

```bash
pnpm install
# o
npm install
```

3. **Inicia el servidor de desarrollo:**

```bash
pnpm dev
# o
npm run dev
```

4. **Abre tu navegador** en `http://localhost:4321`

## 📁 Estructura del Proyecto

```
astro-template-devanthos/
├── public/                  # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── interfaces/      # Componentes de interfaz (.astro)
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   ├── Hero.astro   # Sección hero principal
│   │   │   ├── RichResults.astro
│   │   │   └── SEO.astro
│   │   └── ui/             # Componentes UI (.tsx)
│   │       └── button.tsx  # Componente Button con variantes
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── lib/
│   │   └── utils.ts        # Utilidades (cn function)
│   ├── pages/
│   │   ├── index.astro     # 🔥 Página principal
│   │   └── markdown-page.md
│   └── styles/
│       └── global.css      # Estilos globales
├── astro.config.mjs        # Configuración de Astro
├── components.json         # Configuración de shadcn/ui
├── package.json
├── tailwind.config.mjs     # Configuración de Tailwind
└── tsconfig.json
```

## 🎯 Cómo Usar el Template

### 1. Página Principal (`src/pages/index.astro`)

Este es el **corazón de tu sitio web**. Aquí puedes agregar todas las secciones que necesites:

```astro
---
import Layout from '@/layouts/Layout.astro';
import Hero from '@/components/interfaces/Hero.astro';
// import TuNuevaSeccion from '@/components/interfaces/TuNuevaSeccion.astro';
---

<Layout
    title="Tu Título"
    description="Tu descripción"
    canonical="https://tu-sitio.com/"
    image="https://tu-sitio.com/imagen.jpg">
    <Hero />
    <!-- <TuNuevaSeccion /> -->
    <!-- Agrega más secciones aquí -->
</Layout>
```

### 2. Crear Nuevas Secciones

Para agregar una nueva sección a tu sitio:

1. **Crea un nuevo archivo** en `src/components/interfaces/`:

```astro
---
// Lógica del componente (opcional)
---

<!-- src/components/interfaces/MiSeccion.astro -->
<section class="py-16">
    <div class="container mx-auto px-4">
        <h2 class="mb-8 text-center text-3xl font-bold">Mi Nueva Sección</h2>
        <p class="text-muted-foreground text-center">Contenido de tu sección...</p>
    </div>
</section>
```

2. **Importa y usa** en `index.astro`:

```astro
---
import MiSeccion from '@/components/interfaces/MiSeccion.astro';
---

<Layout>
    <Hero />
    <MiSeccion />
</Layout>
```

### 3. Personalizar el Hero

El componente Hero está en `src/components/interfaces/Hero.astro`. Puedes modificar:

- **Título y descripción**
- **Textos de los botones**
- **Colores y estilos**
- **Elementos visuales**

### 4. Componentes UI Disponibles

#### Button

```tsx
import { Button } from '@/components/ui/button';

// Variantes disponibles
<Button variant="default">Botón Principal</Button>
<Button variant="outline">Botón Secundario</Button>
<Button variant="ghost">Botón Fantasma</Button>

// Tamaños disponibles
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
```

### 5. Iconos (Lucide React)

```astro
---
import { ArrowRight, Code2, Star } from 'lucide-react';
---

<ArrowRight className="h-4 w-4" />
<Code2 className="h-6 w-6" />
<Star className="h-8 w-8" />
```

### 6. Estilos con Tailwind CSS

El template utiliza Tailwind CSS. Algunos ejemplos útiles:

```css
/* Textos */
.text-primary    /* Color principal */
.text-muted-foreground  /* Texto secundario */

/* Espaciado */
.py-16           /* Padding vertical */
.container       /* Contenedor responsivo */
.mx-auto         /* Centrar horizontalmente */

/* Responsive */
.sm:text-lg      /* Texto grande en pantallas pequeñas */
.lg:text-xl      /* Texto extra grande en pantallas grandes */
```

## 🎨 Personalización

### Cambiar Colores

Edita `src/styles/global.css` para personalizar la paleta de colores:

```css
:root {
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 84% 4.9%;
    /* Más variables... */
}
```

### Configurar SEO

Edita el componente `Layout.astro` para configurar:

- Meta tags
- Open Graph
- Título y descripción por defecto
- Canonical URLs

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción para producción
pnpm build

# Vista previa de la build
pnpm preview
```

## 🚀 Despliegue

El template está listo para desplegar en:

- **Vercel** - Conecta tu repositorio
- **Netlify** - Deploy automático
- **GitHub Pages** - Gratis para repositorios públicos
- **Cualquier hosting** - Build estático

```bash
# Generar build de producción
pnpm build

# Los archivos estarán en /dist
```

## 📚 Recursos Útiles

- [Documentación de Astro](https://docs.astro.build/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Componentes shadcn/ui](https://ui.shadcn.com/)
- [Iconos Lucide](https://lucide.dev/)

## 🤝 Contribuir

¿Encontraste un bug o tienes una idea? ¡Las contribuciones son bienvenidas!

## 📄 Licencia

Este template es de código abierto y está disponible bajo la licencia MIT.

---

**¡Feliz desarrollo! 🎉**

> Template creado con ❤️ por Devanthos
