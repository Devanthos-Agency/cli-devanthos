# 📝 Plugin Content - Devanthos

Sistema de gestión de contenido con MDX (Markdown + JSX) para Astro y Next.js.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Content Collections (Astro)](#content-collections-astro)
- [MDX Remote (Next.js)](#mdx-remote-nextjs)
- [Frontmatter](#frontmatter)
- [Componentes en MDX](#componentes-en-mdx)
- [RSS Feed](#rss-feed)
- [Best Practices](#best-practices)

---

## ✨ Características

- ✅ **MDX**: Markdown con componentes React/Vue/Svelte
- ✅ **Type-safe**: Schemas validados con Zod (Astro)
- ✅ **Frontmatter**: Metadatos en cada post
- ✅ **Reading Time**: Tiempo de lectura calculado
- ✅ **Syntax Highlighting**: Código con highlighting
- ✅ **RSS Feed**: Generación automática de RSS
- ✅ **Draft Mode**: Posts en borrador
- ✅ **Tags/Categories**: Organización de contenido

---

## 📦 Instalación

### Astro

```bash
npm install @astrojs/mdx @astrojs/rss reading-time
```

### Next.js

```bash
npm install next-mdx-remote gray-matter reading-time remark-gfm
```

---

## ⚙️ Configuración

### Astro

#### 1. astro.config.mjs

```javascript
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
    integrations: [mdx()]
});
```

#### 2. Estructura de Carpetas

```
src/
├── content/
│   ├── config.ts          # Configuración de collections
│   └── blog/              # Posts del blog
│       ├── post-1.md
│       └── post-2.mdx
```

### Next.js

#### 1. Estructura de Carpetas

```
content/
└── posts/
    ├── post-1.mdx
    └── post-2.mdx
```

---

## 🚀 Uso

### Astro

#### Crear un Post

````markdown
---
title: "Mi Primer Post"
description: "Una introducción a MDX"
pubDate: 2024-01-15
author: "Tu Nombre"
tags: ["astro", "mdx"]
---

# Mi Primer Post

Este es un ejemplo de **MDX** con Astro.

## Código

```javascript
console.log("Hola Mundo");
`` `
```
````

#### Listar Posts

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<div>
  <h1>Blog</h1>
  {posts.map(post => (
    <article>
      <h2>{post.data.title}</h2>
      <p>{post.data.description}</p>
      <a href={`/blog/${post.slug}`}>Leer más</a>
    </article>
  ))}
</div>
```

#### Renderizar un Post

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <time>{post.data.pubDate.toLocaleDateString()}</time>
  <Content />
</article>
```

### Next.js

#### Crear un Post

```markdown
---
title: "Mi Primer Post"
description: "Una introducción a MDX"
date: "2024-01-15"
author: "Tu Nombre"
tags: ["nextjs", "mdx"]
---

# Mi Primer Post

Este es un ejemplo de **MDX** con Next.js.
```

#### Listar Posts

```tsx
// app/blog/page.tsx
import { getAllPosts } from "@/lib/mdx";

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div>
            <h1>Blog</h1>
            {posts.map(post => (
                <article key={post.slug}>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <span>{post.readingTime}</span>
                    <a href={`/blog/${post.slug}`}>Leer más</a>
                </article>
            ))}
        </div>
    );
}
```

#### Renderizar un Post

```tsx
// app/blog/[slug]/page.tsx
import { getPost, getAllPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    return (
        <article>
            <h1>{post.title}</h1>
            <time>{post.date}</time>
            <span>{post.readingTime}</span>
            <MDXRemote {...post.content} />
        </article>
    );
}
```

---

## 📚 Content Collections (Astro)

### Schema de Validación

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string().default("Devanthos"),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false)
    })
});

export const collections = {
    blog: blogCollection
};
```

### Filtrar Posts

```astro
---
// Posts publicados
const published = await getCollection('blog', ({ data }) => {
  return !data.draft;
});

// Posts por tag
const astroPosts = await getCollection('blog', ({ data }) => {
  return data.tags.includes('astro');
});

// Posts recientes
const recent = await getCollection('blog');
recent.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
const latestPosts = recent.slice(0, 5);
---
```

---

## 🎨 Componentes en MDX

### Astro

```mdx
---
title: "Post con Componentes"
---

import Button from "../../components/Button.astro";
import Alert from "../../components/Alert.astro";

# Post con Componentes

<Alert type="info">Esto es un componente personalizado!</Alert>

<Button>Haz click aquí</Button>
```

### Next.js

```mdx
---
title: "Post con Componentes"
---

# Post con Componentes

Puedes usar componentes React aquí!
```

```tsx
// app/blog/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote";
import Button from "@/components/Button";
import Alert from "@/components/Alert";

const components = {
    Button,
    Alert
};

// En el render:
<MDXRemote {...post.content} components={components} />;
```

---

## 📰 RSS Feed

### Astro

```typescript
// src/pages/rss.xml.ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
    const posts = await getCollection("blog");

    return rss({
        title: "Mi Blog",
        description: "Un blog increíble",
        site: context.site,
        items: posts.map(post => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: `/blog/${post.slug}/`
        }))
    });
}
```

Disponible en: `https://tu-sitio.com/rss.xml`

---

## 📊 Best Practices

### 1. Nombres de Archivos

```
✅ Bien:
- mi-primer-post.md
- introduccion-a-react.mdx
- 2024-01-15-nuevo-feature.md

❌ Mal:
- Post 1.md (espacios)
- My_Post.md (underscores)
- post.md (poco descriptivo)
```

### 2. Frontmatter Consistente

```yaml
---
# Campos requeridos
title: "Título del Post"
description: "Descripción breve"
pubDate: 2024-01-15

# Campos opcionales pero recomendados
author: "Tu Nombre"
image: "/images/post-cover.jpg"
tags: ["tag1", "tag2"]
draft: false
---
```

### 3. Estructura de Contenido

```markdown
# Título Principal (H1) - Solo uno

Introducción breve del contenido.

## Sección 1 (H2)

Contenido de la sección.

### Subsección (H3)

Más detalles.

## Sección 2 (H2)

Más contenido.
```

### 4. Imágenes Optimizadas

```markdown
<!-- Usa rutas relativas -->

![Alt text](../../images/mi-imagen.jpg)

<!-- O URLs absolutas -->

![Alt text](https://example.com/image.jpg)

<!-- Siempre incluye alt text -->
```

---

## 🔧 Troubleshooting

### Astro: Error al importar collection

```bash
# Reinicia el servidor
npm run dev
```

### Next.js: Posts no se encuentran

```typescript
// Verifica que la ruta sea correcta
const postsDirectory = path.join(process.cwd(), "content/posts");
```

### MDX no se renderiza

#### Astro:

```javascript
// Asegúrate de tener la integración en astro.config.mjs
import mdx from "@astrojs/mdx";

export default defineConfig({
    integrations: [mdx()]
});
```

#### Next.js:

```tsx
// Usa MDXRemote correctamente
import { MDXRemote } from "next-mdx-remote";

<MDXRemote {...content} />;
```

---

## 🎯 Ejemplos Avanzados

### Sistema de Tags

```astro
---
// src/pages/blog/tags/[tag].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const tags = [...new Set(posts.flatMap(post => post.data.tags))];

  return tags.map(tag => ({
    params: { tag },
    props: {
      posts: posts.filter(post => post.data.tags.includes(tag))
    }
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<h1>Posts tagged with: {tag}</h1>
{posts.map(post => (
  <article>
    <h2>{post.data.title}</h2>
  </article>
))}
```

### Búsqueda de Posts

```typescript
function searchPosts(query: string, posts: Post[]) {
    const lowerQuery = query.toLowerCase();

    return posts.filter(
        post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.description.toLowerCase().includes(lowerQuery) ||
            post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}
```

---

## 📚 Recursos

- [MDX Documentation](https://mdxjs.com/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)

---

**Versión:** 1.0.0  
**Licencia:** MIT  
**Autor:** Devanthos
