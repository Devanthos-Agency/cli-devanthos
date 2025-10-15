# 🔍 Plugin SEO - Devanthos

Plugin para optimización SEO completa incluyendo meta tags, OpenGraph, Twitter Cards, sitemap y robots.txt.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Componentes](#componentes)
- [Sitemap](#sitemap)
- [Robots.txt](#robotstxt)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Meta Tags Optimizados**: Descripción, keywords, canonical
- ✅ **OpenGraph**: Para Facebook, LinkedIn y otras redes sociales
- ✅ **Twitter Cards**: Cards optimizadas para Twitter
- ✅ **Sitemap**: Generación automática de sitemap.xml
- ✅ **Robots.txt**: Configuración para crawlers
- ✅ **Multi-framework**: Soporte para Astro y Next.js
- ✅ **TypeScript**: Completamente tipado

---

## 📦 Instalación

### Astro

```bash
npm install @astrojs/sitemap @astrojs/rss
```

### Next.js

```bash
npm install next-seo next-sitemap
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz de tu proyecto:

```env
SITE_URL=https://tu-dominio.com
```

### 2. Astro - astro.config.mjs

```javascript
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://tu-dominio.com",
    integrations: [sitemap()]
});
```

### 3. Next.js - package.json

Agrega el script para generar el sitemap después del build:

```json
{
    "scripts": {
        "build": "next build",
        "postbuild": "next-sitemap"
    }
}
```

---

## 🚀 Uso

### Astro

```astro
---
import SEO from '../components/SEO.astro';
---

<html>
  <head>
    <SEO
      title="Mi Página Increíble"
      description="Esta es una descripción optimizada para SEO"
      image="https://mi-sitio.com/og-image.jpg"
      canonical="https://mi-sitio.com/pagina"
    />
  </head>
  <body>
    <!-- Tu contenido -->
  </body>
</html>
```

### Next.js

```tsx
import { SEO } from "@/components/SEO";

export default function Page() {
    return (
        <>
            <SEO
                title="Mi Página Increíble"
                description="Esta es una descripción optimizada para SEO"
                image="https://mi-sitio.com/og-image.jpg"
                canonical="https://mi-sitio.com/pagina"
            />

            <main>{/* Tu contenido */}</main>
        </>
    );
}
```

---

## 🧩 Componentes

### Props del Componente SEO

| Prop          | Tipo     | Requerido | Descripción                                   |
| ------------- | -------- | --------- | --------------------------------------------- |
| `title`       | `string` | ✅        | Título de la página (50-60 caracteres)        |
| `description` | `string` | ✅        | Descripción de la página (150-160 caracteres) |
| `image`       | `string` | ❌        | URL de la imagen OG (1200x630px recomendado)  |
| `canonical`   | `string` | ❌        | URL canónica de la página                     |

### Ejemplo Completo

```tsx
<SEO
    title="Guía Completa de SEO 2024"
    description="Aprende las mejores prácticas de SEO en 2024 con esta guía completa y actualizada."
    image="https://ejemplo.com/images/seo-guide-og.jpg"
    canonical="https://ejemplo.com/guias/seo-2024"
/>
```

---

## 🗺️ Sitemap

### Astro

El sitemap se genera automáticamente al hacer build:

```bash
npm run build
```

Sitemap disponible en: `https://tu-sitio.com/sitemap-index.xml`

### Next.js

Configura `next-sitemap.config.js` (ya incluido):

```javascript
module.exports = {
    siteUrl: process.env.SITE_URL || "https://ejemplo.com",
    generateRobotsTxt: true,
    // Excluir rutas específicas
    exclude: ["/admin/*", "/api/*"],
    // Configuración adicional
    robotsTxtOptions: {
        additionalSitemaps: ["https://ejemplo.com/my-custom-sitemap.xml"]
    }
};
```

El sitemap se genera automáticamente después del build:

```bash
npm run build
```

---

## 🤖 Robots.txt

### Astro

El archivo `robots.txt` se encuentra en `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://ejemplo.com/sitemap-index.xml
```

### Next.js

Se genera automáticamente con `next-sitemap`. Para personalizarlo:

```javascript
// next-sitemap.config.js
module.exports = {
    // ...otras opciones
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/private"]
            },
            {
                userAgent: "Googlebot",
                allow: "/"
            }
        ]
    }
};
```

---

## 📊 Best Practices

### 1. Títulos Optimizados

```tsx
// ❌ Mal
<SEO title="Página" description="Una página" />

// ✅ Bien
<SEO
  title="Guía Completa de React 2024 - Aprende React desde Cero"
  description="Aprende React con esta guía completa y actualizada. Incluye hooks, context, routing y best practices."
/>
```

**Recomendaciones:**

- Título: 50-60 caracteres
- Descripción: 150-160 caracteres
- Incluir keywords principales
- Único para cada página

### 2. Imágenes OpenGraph

```tsx
// Tamaño recomendado: 1200x630px
<SEO
    title="Mi Artículo"
    description="Descripción del artículo"
    image="https://ejemplo.com/images/og-article.jpg"
/>
```

**Recomendaciones:**

- Resolución: 1200x630px
- Formato: JPG o PNG
- Peso: < 1MB
- Texto legible en la imagen

### 3. URLs Canónicas

```tsx
// Evita contenido duplicado
<SEO title="Mi Página" description="Descripción" canonical="https://ejemplo.com/mi-pagina" />
```

---

## 🔧 Troubleshooting

### El sitemap no se genera

**Next.js:**

```bash
# Verifica que el script postbuild esté en package.json
npm run postbuild

# Si no funciona, ejecuta manualmente
npx next-sitemap
```

**Astro:**

```bash
# Verifica la configuración en astro.config.mjs
# Debe incluir:
integrations: [sitemap()]
```

### Las meta tags no aparecen

1. Verifica que el componente SEO esté en el `<head>`
2. Usa las DevTools para inspeccionar
3. Verifica que no haya otros componentes sobreescribiendo las tags

### OpenGraph no funciona en redes sociales

1. **Verifica las tags:**
    - Usa el [Facebook Debugger](https://developers.facebook.com/tools/debug/)
    - Usa el [Twitter Card Validator](https://cards-dev.twitter.com/validator)

2. **Limpia la caché:**
    - Facebook puede cachear las tags
    - Usa el debugger para forzar un refresh

3. **Verifica la imagen:**
    - Debe ser accesible públicamente
    - Tamaño correcto (1200x630px)
    - Formato soportado (JPG, PNG)

---

## 📚 Recursos Adicionales

### Herramientas de Testing

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Guías de SEO

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs SEO Guide](https://ahrefs.com/seo)

### Documentación

- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Astro SEO](https://docs.astro.build/en/guides/rss/)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

## 🎯 Checklist SEO

Antes de lanzar tu sitio, verifica:

- [ ] Todas las páginas tienen título único
- [ ] Todas las páginas tienen descripción única
- [ ] Las imágenes OG son 1200x630px
- [ ] URLs canónicas configuradas
- [ ] Sitemap generado y accesible
- [ ] Robots.txt configurado
- [ ] Probado con Facebook Debugger
- [ ] Probado con Twitter Card Validator
- [ ] Probado con Google Rich Results Test
- [ ] SITE_URL configurada en producción

---

## 💡 Ejemplos Avanzados

### SEO Dinámico con Datos de API

```tsx
// Next.js
export default function BlogPost({ post }) {
    return (
        <>
            <SEO
                title={`${post.title} - Mi Blog`}
                description={post.excerpt}
                image={post.coverImage}
                canonical={`https://mi-blog.com/posts/${post.slug}`}
            />

            <article>{/* Contenido del post */}</article>
        </>
    );
}
```

### SEO Multi-idioma

```tsx
// Astro
---
import SEO from '../components/SEO.astro';

const { lang = 'es' } = Astro.params;
const translations = {
  es: {
    title: 'Mi Sitio en Español',
    description: 'Descripción en español'
  },
  en: {
    title: 'My Site in English',
    description: 'Description in English'
  }
};
---

<html lang={lang}>
  <head>
    <SEO
      title={translations[lang].title}
      description={translations[lang].description}
    />
  </head>
</html>
```

---

**Versión:** 1.0.0  
**Última actualización:** 2024  
**Licencia:** MIT  
**Autor:** Devanthos
