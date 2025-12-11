# 💳 Integración con Mercado Pago

Esta integración te permite agregar pagos con Mercado Pago a tu proyecto Next.js.

## Instalación

```bash
npm install mercadopago
# o
pnpm add mercadopago
```

## Configuración

### 1. Variables de entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
```

> ⚠️ Obtén tus credenciales en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)

### 2. Copiar archivos

Copia los archivos de esta carpeta a tu proyecto:

- `lib/mercadopago.ts` → `src/lib/mercadopago.ts`
- `app/api/mercadopago/` → `src/app/api/mercadopago/`
- `components/checkout-button.tsx` → `src/components/checkout-button.tsx`

## Uso

### Crear una preferencia de pago (Server Side)

```typescript
import { createPreference } from "@/lib/mercadopago";

const preference = await createPreference({
    items: [
        {
            title: "Mi Producto",
            unit_price: 1000,
            quantity: 1
        }
    ],
    payer: {
        email: "cliente@email.com"
    }
});
```

### Botón de checkout (Client Side)

```tsx
import { CheckoutButton } from "@/components/checkout-button";

export default function ProductPage() {
    return (
        <CheckoutButton
            preferenceId="tu-preference-id"
            onSuccess={paymentId => console.log("Pago exitoso:", paymentId)}
            onError={error => console.error("Error:", error)}
        />
    );
}
```

## Webhooks

La ruta `/api/mercadopago/webhook` está configurada para recibir notificaciones de Mercado Pago.

Configura la URL del webhook en tu panel de Mercado Pago:

```
https://tu-dominio.com/api/mercadopago/webhook
```

## Recursos

- [Documentación oficial de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [SDK de Node.js](https://github.com/mercadopago/sdk-nodejs)
