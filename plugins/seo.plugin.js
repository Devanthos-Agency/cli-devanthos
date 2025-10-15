/**
 * @devanthos/plugin-seo
 *
 * Plugin para optimización SEO (meta tags, sitemap, robots.txt, OpenGraph)
 */

export default {
    name: "@devanthos/plugin-seo",
    version: "1.0.0",
    description: "Agrega configuración SEO y meta tags optimizados",

    async afterClone({ _projectName, framework }) {
        console.log(`🔍 [SEO Plugin] Configurando SEO para ${framework}...`);
    },

    dependencies: {
        astro: ["@astrojs/sitemap", "@astrojs/rss"],
        next: ["next-seo", "next-sitemap"]
    },

    files: {
        astro: [
            {
                path: "src/components/SEO.astro",
                content: `---
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const { title, description, image, canonical } = Astro.props;
const siteUrl = Astro.site?.toString() || 'https://ejemplo.com';
const ogImage = image || \`\${siteUrl}/og-image.jpg\`;
---

<meta name="description" content={description} />
<link rel="canonical" href={canonical || Astro.url.pathname} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url.pathname} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url.pathname} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={ogImage} />
`
            },
            {
                path: "public/robots.txt",
                content: `User-agent: *
Allow: /

Sitemap: https://ejemplo.com/sitemap-index.xml
`
            }
        ],
        next: [
            {
                path: "components/SEO.tsx",
                content: `import { NextSeo } from 'next-seo';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

export function SEO({ title, description, image, canonical }: SEOProps) {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      openGraph={{
        title,
        description,
        images: image ? [{ url: image }] : [],
      }}
      twitter={{
        cardType: 'summary_large_image',
      }}
    />
  );
}
`
            },
            {
                path: "next-sitemap.config.js",
                content: `/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ejemplo.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
`
            }
        ]
    },

    postInstall: {
        message: "🔍 SEO configurado. Actualiza la URL del sitio en las configuraciones.",
        envVars: ["SITE_URL"]
    }
};
