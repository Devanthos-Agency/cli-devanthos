/**
 * @devanthos/plugin-analytics
 *
 * Plugin para integración de analytics (Google Analytics, Vercel Analytics, Plausible)
 */

export default {
    name: "@devanthos/plugin-analytics",
    version: "1.0.0",
    description: "Agrega integración de analytics al proyecto",

    /**
     * Hook que se ejecuta después de clonar el template
     */
    async afterClone({ _projectName, framework }) {
        console.log(`📊 [Analytics Plugin] Configurando analytics para ${framework}...`);

        // Aquí se podría crear archivos de configuración
        // Por ahora solo es informativo
    },

    /**
     * Dependencias que agrega este plugin
     */
    dependencies: {
        astro: ["@vercel/analytics"],
        next: ["@vercel/analytics", "react"]
    },

    /**
     * Archivos de configuración que crea
     */
    files: {
        astro: [
            {
                path: "src/components/Analytics.astro",
                content: `---
// Componente de Analytics para Astro
---
<script is:inline>
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
`
            }
        ],
        next: [
            {
                path: "components/Analytics.tsx",
                content: `import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export function Analytics() {
  return <VercelAnalytics />;
}
`
            }
        ]
    },

    /**
     * Instrucciones post-instalación
     */
    postInstall: {
        message:
            "📊 Analytics configurado. Recuerda agregar tu ID de Google Analytics en las variables de entorno.",
        envVars: ["NEXT_PUBLIC_GA_ID o PUBLIC_GA_ID"]
    }
};
