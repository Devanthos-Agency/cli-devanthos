# 📊 Plugin Analytics - Devanthos

Integración de Google Analytics y Vercel Analytics para Astro y Next.js.

## 📦 Instalación

Este plugin se incluye automáticamente en los presets:

- `landing-page`
- `portfolio`

```bash
npx create-devanthos-app mi-sitio -p landing-page
```

## 🚀 Características

- ✅ Google Analytics 4 (GA4)
- ✅ Vercel Analytics
- ✅ Tracking de pageviews
- ✅ Eventos personalizados
- ✅ TypeScript support
- ✅ Componentes listos para usar

## 📁 Archivos Generados

### Astro

```
src/
└── components/
    └── Analytics.astro         # Componente de GA4
```

### Next.js

```
├── components/
│   └── Analytics.tsx          # Componente de Vercel Analytics
└── lib/
    └── analytics.ts           # Helpers para eventos
```

## ⚙️ Configuración

### Variables de Entorno

#### Astro

```env
PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Next.js

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Obtener tu ID de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com)
2. Crea una propiedad (GA4)
3. Copia el "Measurement ID" (formato: `G-XXXXXXXXXX`)

## 💻 Uso

### Astro

**1. Importar en tu layout principal:**

```astro
---
// src/layouts/Layout.astro
import Analytics from '../components/Analytics.astro';
---

<!DOCTYPE html>
<html>
  <head>
    <title>Mi Sitio</title>
  </head>
  <body>
    <slot />
    <Analytics />  <!-- Agregar antes de </body> -->
  </body>
</html>
```

**2. Verificar que funciona:**

Abre las DevTools → Network → Busca requests a `google-analytics.com`

### Next.js

**1. Agregar en el layout raíz:**

```tsx
// app/layout.tsx
import { Analytics } from "@/components/Analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
```

**2. Tracking de navegación (opcional):**

```tsx
// app/layout.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import * as analytics from "@/lib/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();
        analytics.pageview(url);
    }, [pathname, searchParams]);

    return null;
}
```

## 🎯 Eventos Personalizados

### Next.js

```tsx
import * as analytics from "@/lib/analytics";

// En tu componente o función
const handleButtonClick = () => {
    analytics.event({
        action: "click",
        category: "engagement",
        label: "CTA Button",
        value: 1
    });
};

// Ejemplos de eventos
analytics.event({
    action: "purchase",
    category: "ecommerce",
    label: "Product XYZ",
    value: 99.99
});

analytics.event({
    action: "signup",
    category: "user",
    label: "Newsletter"
});

analytics.event({
    action: "download",
    category: "content",
    label: "PDF Guide"
});
```

### Astro

```astro
---
// En cualquier componente Astro
---

<button onclick="gtag('event', 'click', {
  event_category: 'engagement',
  event_label: 'CTA Button'
})">
  Click Me
</button>
```

## 📊 Ver Estadísticas

### Google Analytics

1. Ve a [analytics.google.com](https://analytics.google.com)
2. Selecciona tu propiedad
3. Explora los reportes:
    - **Tiempo real:** Ver visitantes en vivo
    - **Engagement:** Páginas más vistas
    - **Conversiones:** Eventos personalizados

### Vercel Analytics (Next.js)

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com)
2. Tab "Analytics"
3. Ve métricas de rendimiento:
    - Page views
    - Visitantes únicos
    - Top páginas
    - Performance Score

## 🎨 Personalización

### Deshabilitar en Desarrollo

```typescript
// lib/analytics.ts
const isDev = process.env.NODE_ENV === "development";

export const event = ({ action, category, label, value }) => {
    if (isDev) {
        console.log("Analytics Event:", { action, category, label, value });
        return;
    }

    if (typeof window.gtag !== "undefined") {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};
```

### Múltiples IDs de Analytics

```typescript
// Configurar múltiples propiedades
window.gtag("config", "G-XXXXXXXXXX"); // Producción
window.gtag("config", "G-YYYYYYYYYY"); // Staging
```

## 🔒 Privacidad y GDPR

### Agregar Consent Banner

```tsx
"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("analytics-consent");
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("analytics-consent", "true");
        setShowBanner(false);

        // Activar analytics
        window.gtag("consent", "update", {
            analytics_storage: "granted"
        });
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <p>Usamos cookies para mejorar tu experiencia.</p>
                <button onClick={acceptCookies} className="bg-blue-600 px-4 py-2 rounded">
                    Aceptar
                </button>
            </div>
        </div>
    );
}
```

### Anonimizar IPs

```astro
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    anonymize_ip: true  // ← Anonimizar IPs
  });
</script>
```

## 📈 Métricas Recomendadas

### E-commerce

```typescript
// Agregar al carrito
analytics.event({
    action: "add_to_cart",
    category: "ecommerce",
    label: productName,
    value: price
});

// Compra completada
analytics.event({
    action: "purchase",
    category: "ecommerce",
    value: totalAmount
});
```

### Blog

```typescript
// Lectura completa
analytics.event({
    action: "read_complete",
    category: "engagement",
    label: postTitle
});

// Compartir en redes
analytics.event({
    action: "share",
    category: "social",
    label: platform
});
```

### SaaS

```typescript
// Registro
analytics.event({
    action: "signup",
    category: "conversion",
    label: plan
});

// Upgrade
analytics.event({
    action: "upgrade",
    category: "conversion",
    value: newPlanPrice
});
```

## 🐛 Troubleshooting

### Analytics no funciona

**Solución:**

1. Verifica que `PUBLIC_GA_ID` o `NEXT_PUBLIC_GA_ID` esté configurado
2. Revisa la consola del navegador para errores
3. Desactiva ad-blockers
4. Verifica en GA4 "Tiempo Real" para ver tráfico

### No veo eventos personalizados

**Solución:**

1. Ve a GA4 → Configure → Events
2. Espera 24-48 horas para que aparezcan en reportes
3. Usa "DebugView" en GA4 para ver eventos en tiempo real

## 📚 Recursos

- [Google Analytics 4 Docs](https://support.google.com/analytics/answer/9304153)
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GDPR Compliance](https://support.google.com/analytics/answer/9019185)

## 🆘 Soporte

Si tienes problemas:

1. Revisa [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
2. Verifica variables de entorno
3. Consulta la documentación de Google Analytics
4. Abre un issue en el repositorio de Devanthos

---

**Plugin creado por:** [Devanthos](https://devanthos.com)
**Versión:** 1.0.0
**Última actualización:** 14 de enero de 2025
