/**
 * @devanthos/plugin-content
 *
 * Plugin para gestión de contenido (MDX, Content Collections, CMS)
 */

export default {
    name: "@devanthos/plugin-content",
    version: "1.0.0",
    description: "Agrega sistema de gestión de contenido con MDX",

    async afterClone({ _projectName, framework }) {
        console.log(`📝 [Content Plugin] Configurando sistema de contenido para ${framework}...`);
    },

    dependencies: {
        astro: ["@astrojs/mdx", "@astrojs/rss", "reading-time"],
        next: ["next-mdx-remote", "gray-matter", "reading-time", "remark-gfm"]
    },

    files: {
        astro: [
            {
                path: "src/content/config.ts",
                content: `import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Devanthos'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
`
            },
            {
                path: "src/content/blog/primer-post.md",
                content: `---
title: "Mi primer post"
description: "Este es mi primer post usando Astro"
pubDate: 2024-01-01
author: "Tu Nombre"
tags: ["astro", "blog"]
---

# Mi primer post

¡Bienvenido a mi blog! Este es un ejemplo de cómo usar **MDX** con Astro.

## Características

- ✅ Markdown mejorado
- ✅ Componentes React/Vue/Svelte
- ✅ Syntax highlighting
- ✅ Frontmatter

\`\`\`javascript
const saludo = "Hola desde MDX";
console.log(saludo);
\`\`\`
`
            }
        ],
        next: [
            {
                path: "lib/mdx.ts",
                content: `import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  content: string;
  readingTime: string;
}

export async function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, \`\${slug}.mdx\`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const mdxSource = await serialize(content);
  const stats = readingTime(content);

  return {
    slug,
    ...data,
    content: mdxSource,
    readingTime: stats.text,
  } as Post;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      ...data,
      content,
      readingTime: stats.text,
    } as Post;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}
`
            },
            {
                path: "content/posts/primer-post.mdx",
                content: `---
title: "Mi primer post"
description: "Este es mi primer post usando Next.js y MDX"
date: "2024-01-01"
author: "Tu Nombre"
tags: ["nextjs", "mdx", "blog"]
---

# Mi primer post

¡Bienvenido a mi blog! Este es un ejemplo de cómo usar **MDX** con Next.js.

## Características

- ✅ Markdown mejorado
- ✅ Componentes React
- ✅ Syntax highlighting
- ✅ Frontmatter

\`\`\`typescript
const saludo: string = "Hola desde MDX";
console.log(saludo);
\`\`\`
`
            }
        ]
    },

    postInstall: {
        message: "📝 Sistema de contenido configurado. Puedes empezar a escribir en /content",
        instructions: [
            "1. Crea archivos .md o .mdx en src/content/blog (Astro) o content/posts (Next)",
            "2. Usa el frontmatter para metadatos",
            "3. Importa y renderiza tus posts"
        ]
    }
};
