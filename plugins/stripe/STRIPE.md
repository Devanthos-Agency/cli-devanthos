# 💳 Plugin Stripe - Devanthos

Integración completa de pagos con Stripe para Next.js.

## 📦 Instalación

Este plugin se instala automáticamente cuando usas el preset `ecommerce`:

```bash
npx create-devanthos-app mi-tienda -p ecommerce
```

## 🚀 Características

- ✅ Checkout API completo
- ✅ Webhook handler para eventos
- ✅ Componente `CheckoutButton` listo para usar
- ✅ TypeScript support
- ✅ Manejo de errores
- ✅ Redirección automática

## 📁 Archivos Generados

```
tu-proyecto/
├── lib/
│   └── stripe.ts                    # Cliente de Stripe
├── app/
│   └── api/
│       ├── checkout/
│       │   └── route.ts            # API de checkout
│       └── webhook/
│           └── route.ts            # Webhook handler
└── components/
    └── CheckoutButton.tsx          # Componente de pago
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto:

```env
# Stripe Keys (obtén en https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret (obtén en https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configurar Webhook en Stripe

1. Ve a https://dashboard.stripe.com/webhooks
2. Click en "Add endpoint"
3. URL del endpoint: `https://tu-dominio.com/api/webhook`
4. Eventos a escuchar:
    - `checkout.session.completed`
    - `payment_intent.succeeded`
5. Copia el "Signing secret" a `STRIPE_WEBHOOK_SECRET`

## 💻 Uso

### Componente CheckoutButton

```tsx
import { CheckoutButton } from "@/components/CheckoutButton";

export default function ProductPage() {
    const items = [
        {
            name: "Producto Premium",
            description: "Un producto increíble",
            price: 99.99, // en dólares
            quantity: 1
        }
    ];

    return (
        <div>
            <h1>Compra ahora</h1>
            <CheckoutButton items={items} />
        </div>
    );
}
```

### API de Checkout (personalizada)

```typescript
// En tu componente o página
const handleCustomCheckout = async () => {
    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            items: [
                {
                    name: "Mi Producto",
                    description: "Descripción",
                    price: 50,
                    quantity: 2
                }
            ]
        })
    });

    const { sessionId } = await response.json();

    // Redirigir a Stripe Checkout
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    await stripe?.redirectToCheckout({ sessionId });
};
```

### Cliente de Stripe (uso directo)

```typescript
import { stripe } from "@/lib/stripe";

// Crear un producto
const product = await stripe.products.create({
    name: "Mi Producto",
    description: "Descripción del producto"
});

// Crear un precio
const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000, // $20.00
    currency: "usd"
});

// Listar clientes
const customers = await stripe.customers.list({
    limit: 10
});
```

## 🔔 Webhooks

El archivo `app/api/webhook/route.ts` maneja eventos de Stripe:

```typescript
// Personaliza el handler según tus necesidades
switch (event.type) {
    case "checkout.session.completed":
        const session = event.data.object;

        // Guardar en base de datos
        await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                amount: session.amount_total,
                status: "paid"
            }
        });

        // Enviar email de confirmación
        await sendOrderConfirmationEmail(session);
        break;

    case "payment_intent.succeeded":
        // Procesar pago exitoso
        break;

    case "payment_intent.payment_failed":
        // Manejar pago fallido
        break;
}
```

## 🎨 Personalización del CheckoutButton

```tsx
<CheckoutButton
    items={items}
    className="bg-purple-600 hover:bg-purple-700"
    loadingText="Cargando..."
    buttonText="Comprar Ahora"
/>
```

Puedes modificar `components/CheckoutButton.tsx` para agregar más props.

## 🌍 Cambiar Moneda

En `app/api/checkout/route.ts`:

```typescript
const session = await stripe.checkout.sessions.create({
    // ...
    line_items: items.map(item => ({
        price_data: {
            currency: "eur" // Cambiar a euros, mxn, etc.
            // ...
        }
    }))
});
```

Monedas soportadas: `usd`, `eur`, `gbp`, `mxn`, `ars`, etc.

## 📊 Testing

### Tarjetas de Prueba

Stripe proporciona estas tarjetas para testing:

| Número                | Descripción                      |
| --------------------- | -------------------------------- |
| `4242 4242 4242 4242` | Pago exitoso                     |
| `4000 0000 0000 9995` | Pago rechazado                   |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

- **Fecha:** Cualquier fecha futura
- **CVC:** Cualquier 3 dígitos
- **ZIP:** Cualquier 5 dígitos

## 🚨 Errores Comunes

### Error: "No signature"

**Solución:** Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado correctamente.

### Error: "STRIPE_SECRET_KEY no está definida"

**Solución:** Agrega `STRIPE_SECRET_KEY` a tu archivo `.env.local`.

### Webhook no recibe eventos

**Solución:**

1. Verifica que la URL del webhook sea pública (usa ngrok para desarrollo local)
2. Confirma que los eventos estén seleccionados en el dashboard

## 🔒 Seguridad

✅ **Claves secretas:** Nunca expongas `STRIPE_SECRET_KEY` en el cliente
✅ **Webhook verification:** Siempre verifica la firma del webhook
✅ **HTTPS:** Usa HTTPS en producción
✅ **Validación:** Valida cantidades y productos en el servidor

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Next.js + Stripe Guide](https://stripe.com/docs/payments/checkout/how-checkout-works)
- [Webhook Events](https://stripe.com/docs/api/events/types)

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en [Stripe Dashboard](https://dashboard.stripe.com/logs)
2. Verifica las variables de entorno
3. Consulta la documentación oficial de Stripe
4. Abre un issue en el repositorio de Devanthos

## 📝 Ejemplo Completo

```tsx
// app/productos/[id]/page.tsx
import { CheckoutButton } from "@/components/CheckoutButton";

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = {
        name: "Curso de Next.js",
        description: "Aprende Next.js desde cero",
        price: 99.99
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-8">{product.description}</p>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-3xl font-bold mb-4">${product.price}</p>

                <CheckoutButton
                    items={[
                        {
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            quantity: 1
                        }
                    ]}
                />
            </div>
        </div>
    );
}
```

---

**Plugin creado por:** [Devanthos](https://devanthos.com)
**Versión:** 1.0.0
**Última actualización:** 14 de enero de 2025
