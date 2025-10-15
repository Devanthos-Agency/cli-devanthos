# 💳 Plugin Mercado Pago - Devanthos

Integración completa con Mercado Pago para procesar pagos en Latinoamérica. Compatible con Argentina, Brasil, Chile, Colombia, México, Perú, Uruguay y Venezuela.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Países Soportados](#países-soportados)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Credenciales](#credenciales)
- [Uso](#uso)
- [Componentes](#componentes)
- [API Routes](#api-routes)
- [Webhook](#webhook)
- [Testing](#testing)
- [Estados de Pago](#estados-de-pago)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **Checkout completo** - Redirige a Mercado Pago para procesar pagos
- ✅ **Múltiples métodos de pago** - Tarjetas, efectivo, transferencias
- ✅ **Webhook integrado** - Notificaciones IPN en tiempo real
- ✅ **Componentes React** - CheckoutButton y ProductCard listos
- ✅ **TypeScript** - Completamente tipado
- ✅ **Testing fácil** - Credenciales de prueba integradas
- ✅ **Multi-país** - Soporte para 8 países de LATAM
- ✅ **Seguro** - Cumple con PCI DSS

---

## 🌎 Países Soportados

| País         | Moneda          | Código |
| ------------ | --------------- | ------ |
| 🇦🇷 Argentina | Peso argentino  | ARS    |
| 🇧🇷 Brasil    | Real brasileño  | BRL    |
| 🇨🇱 Chile     | Peso chileno    | CLP    |
| 🇨🇴 Colombia  | Peso colombiano | COP    |
| 🇲🇽 México    | Peso mexicano   | MXN    |
| 🇵🇪 Perú      | Sol peruano     | PEN    |
| 🇺🇾 Uruguay   | Peso uruguayo   | UYU    |
| 🇻🇪 Venezuela | Bolívar         | VES    |

---

## 📦 Instalación

```bash
npm install mercadopago
```

---

## ⚙️ Configuración

### 1. Crear Cuenta en Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta o inicia sesión
3. Ve a "Tus integraciones" → "Crear aplicación"
4. Completa los datos de tu aplicación

### 2. Obtener Credenciales

En el panel de tu aplicación encontrarás:

- **Public Key** - Para el frontend (opcional en este plugin)
- **Access Token** - Para el backend (requerido)

Tienes dos tipos de credenciales:

#### Credenciales de Prueba (Testing)

- Para desarrollo y testing
- No procesan pagos reales
- Tarjetas de prueba disponibles

#### Credenciales de Producción

- Para ambiente productivo
- Procesan pagos reales
- Requiere validación de la cuenta

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz de tu proyecto:

```env
# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui

# En producción
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx-xxxxxxxx
# NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## 🔑 Credenciales

### Obtener Access Token

1. Ve a tu aplicación en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel/app)
2. Click en "Credenciales"
3. Selecciona "Credenciales de prueba" o "Credenciales de producción"
4. Copia el **Access Token**

### Estructura del Access Token

```
TEST-xxxxxxxx-xxxxxx-xxxxxxxx    (Prueba)
APP_USR-xxxxxxxx-xxxxxxxx        (Producción)
```

---

## 🚀 Uso

### Uso Básico con CheckoutButton

```tsx
import { CheckoutButton } from "@/components/mercadopago/CheckoutButton";

export default function ProductPage() {
    return (
        <div>
            <h1>Curso de React</h1>
            <p>Aprende React desde cero</p>

            <CheckoutButton
                items={[
                    {
                        title: "Curso de React",
                        quantity: 1,
                        unit_price: 5000,
                        description: "Curso completo de React"
                    }
                ]}
                buttonText="Comprar ahora"
            />
        </div>
    );
}
```

### Carrito con Múltiples Items

```tsx
<CheckoutButton
    items={[
        {
            title: "Curso de React",
            quantity: 1,
            unit_price: 5000
        },
        {
            title: "Curso de Next.js",
            quantity: 1,
            unit_price: 6000
        }
    ]}
    buttonText="Pagar $11,000"
/>
```

### Usar ProductCard

```tsx
import { ProductCard } from "@/components/mercadopago/ProductCard";

export default function ProductsPage() {
    const products = [
        {
            id: "1",
            title: "Curso de React",
            description: "Aprende React desde cero con proyectos reales",
            price: 5000,
            image: "/images/react-course.jpg"
        },
        {
            id: "2",
            title: "Curso de Next.js",
            description: "Domina Next.js 14 con App Router",
            price: 6000,
            image: "/images/nextjs-course.jpg"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}
```

---

## 🧩 Componentes

### CheckoutButton

Botón listo para iniciar el proceso de pago.

#### Props

```typescript
interface CheckoutButtonProps {
    items: CheckoutItem[]; // Items a pagar
    buttonText?: string; // Texto del botón
    className?: string; // Clases CSS adicionales
    onSuccess?: () => void; // Callback de éxito
    onError?: (error: Error) => void; // Callback de error
}

interface CheckoutItem {
    title: string; // Nombre del producto
    quantity: number; // Cantidad
    unit_price: number; // Precio unitario
    description?: string; // Descripción opcional
}
```

#### Ejemplo con Callbacks

```tsx
<CheckoutButton
    items={items}
    buttonText="Finalizar compra"
    onSuccess={() => {
        console.log("Usuario redirigido a Mercado Pago");
    }}
    onError={error => {
        console.error("Error:", error);
        alert("Error al procesar el pago");
    }}
/>
```

### ProductCard

Tarjeta de producto con botón de compra integrado.

#### Props

```typescript
interface ProductCardProps {
    id: string; // ID único del producto
    title: string; // Nombre del producto
    description: string; // Descripción
    price: number; // Precio
    image?: string; // URL de la imagen
    currency?: string; // Moneda (default: 'ARS')
}
```

---

## 🔌 API Routes

### POST /api/mercadopago/checkout

Crea una preferencia de pago en Mercado Pago.

#### Request

```typescript
POST /api/mercadopago/checkout
Content-Type: application/json

{
  "items": [
    {
      "title": "Producto",
      "quantity": 1,
      "unit_price": 1000,
      "description": "Descripción opcional"
    }
  ],
  "payer": {
    "email": "user@example.com"
  },
  "external_reference": "ORDER-123"
}
```

#### Response

```json
{
    "id": "1234567890",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=xxx",
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=xxx"
}
```

#### Uso desde tu código

```typescript
const response = await fetch("/api/mercadopago/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        items: [{ title: "Producto", quantity: 1, unit_price: 1000 }]
    })
});

const data = await response.json();
window.location.href = data.init_point;
```

### Opciones Avanzadas

```typescript
{
  "items": [...],
  "payer": {
    "email": "user@example.com",
    "name": "Juan",
    "surname": "Pérez",
    "phone": {
      "area_code": "11",
      "number": "1234-5678"
    }
  },
  "back_urls": {
    "success": "https://tu-sitio.com/checkout/success",
    "failure": "https://tu-sitio.com/checkout/failure",
    "pending": "https://tu-sitio.com/checkout/pending"
  },
  "auto_return": "approved",
  "payment_methods": {
    "excluded_payment_types": [
      { "id": "ticket" }  // Excluir pagos en efectivo
    ],
    "installments": 12  // Máximo de cuotas
  },
  "notification_url": "https://tu-sitio.com/api/mercadopago/webhook",
  "external_reference": "ORDER-123",
  "metadata": {
    "user_id": "123",
    "order_id": "456"
  }
}
```

---

## 🔔 Webhook

El webhook recibe notificaciones de Mercado Pago en tiempo real.

### Configurar Webhook

1. Ve a tu aplicación en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel/app)
2. Click en "Webhooks" o "Notificaciones"
3. Agrega la URL de tu webhook:

```
https://tu-dominio.com/api/mercadopago/webhook
```

4. Selecciona eventos a recibir:
    - ✅ Pagos (payment)
    - ✅ Contracargos (chargeback)

### Procesar Notificaciones

El webhook ya está implementado en `app/api/mercadopago/webhook/route.ts`:

```typescript
// El webhook procesa automáticamente las notificaciones
// Solo necesitas implementar tu lógica de negocio

switch (payment.status) {
    case "approved":
        // Pago aprobado
        await activateUserPurchase(payment.external_reference);
        await sendConfirmationEmail(payment.payer.email);
        break;

    case "pending":
        // Pago pendiente
        await notifyPendingPayment(payment.id);
        break;

    case "rejected":
        // Pago rechazado
        await handleRejectedPayment(payment.id);
        break;
}
```

### Ejemplo con Prisma

```typescript
// En webhook/route.ts
import { prisma } from "@/lib/prisma";

if (payment.status === "approved") {
    // Actualizar orden en base de datos
    await prisma.order.update({
        where: { id: payment.external_reference },
        data: {
            status: "PAID",
            paymentId: payment.id,
            paidAt: new Date()
        }
    });

    // Enviar email de confirmación
    await sendEmail({
        to: payment.payer.email,
        subject: "Pago confirmado",
        template: "payment-confirmed",
        data: { orderId: payment.external_reference }
    });
}
```

---

## 🧪 Testing

### Credenciales de Prueba

Usa las **credenciales de prueba** de tu aplicación para testing.

### Tarjetas de Prueba

#### Tarjeta Aprobada

```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: APRO
```

#### Tarjeta Rechazada

```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: OTRE
```

#### Más Escenarios

| Nombre | Resultado                         |
| ------ | --------------------------------- |
| APRO   | Aprobado                          |
| CONT   | Pendiente                         |
| CALL   | Rechazado (llamar para autorizar) |
| FUND   | Rechazado (fondos insuficientes)  |
| SECU   | Rechazado (código de seguridad)   |
| EXPI   | Rechazado (fecha de expiración)   |
| FORM   | Rechazado (error en formulario)   |
| OTRE   | Rechazado (genérico)              |

### Usuarios de Prueba

Crea usuarios de prueba en tu panel de Mercado Pago para simular compradores y vendedores.

---

## 📊 Estados de Pago

### Estados Principales

| Estado         | Descripción       | Acción               |
| -------------- | ----------------- | -------------------- |
| `approved`     | ✅ Pago aprobado  | Entregar producto    |
| `pending`      | ⏳ Pago pendiente | Esperar confirmación |
| `in_process`   | 🔄 En proceso     | Esperar              |
| `rejected`     | ❌ Pago rechazado | Notificar usuario    |
| `cancelled`    | 🚫 Cancelado      | No entregar          |
| `refunded`     | 💰 Reembolsado    | Revertir entrega     |
| `charged_back` | ⚠️ Contracargo    | Investigar           |

### Detalles de Estado

```typescript
const statusDetails = {
    accredited: "Acreditado",
    pending_contingency: "Pendiente de contingencia",
    pending_review_manual: "En revisión manual",
    cc_rejected_bad_filled_card_number: "Número de tarjeta incorrecto",
    cc_rejected_bad_filled_date: "Fecha incorrecta",
    cc_rejected_bad_filled_security_code: "CVV incorrecto",
    cc_rejected_insufficient_amount: "Fondos insuficientes",
    cc_rejected_call_for_authorize: "Llamar para autorizar"
};
```

---

## 📊 Best Practices

### 1. Seguridad

```typescript
// ❌ NO expongas el Access Token en el frontend
// ✅ Úsalo solo en el backend (API Routes)

// backend only
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});
```

### 2. Manejo de Errores

```typescript
try {
    const preference = await createPreference(data);
    return preference;
} catch (error) {
    // Log detallado para debugging
    console.error("Error al crear preferencia:", {
        error: error.message,
        data,
        timestamp: new Date().toISOString()
    });

    // Mensaje genérico al usuario
    throw new Error("Error al procesar el pago");
}
```

### 3. External Reference

Usa `external_reference` para vincular pagos con tu sistema:

```typescript
const preference = await createPreference({
  items: [...],
  external_reference: `ORDER-${orderId}`,
  metadata: {
    user_id: userId,
    campaign: 'summer-sale',
  },
});
```

### 4. Idempotencia

Usa keys de idempotencia para evitar pagos duplicados:

```typescript
const headers = {
    "X-Idempotency-Key": `${userId}-${orderId}-${timestamp}`
};
```

### 5. URLs de Retorno

```typescript
back_urls: {
  success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderId}`,
  failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure?order=${orderId}`,
  pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?order=${orderId}`,
}
```

---

## 🔧 Troubleshooting

### Error: Access Token inválido

```bash
Error: invalid_client
```

**Solución:**

1. Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté en `.env`
2. Asegúrate de usar el token correcto (TEST o PROD)
3. Reinicia el servidor después de cambiar `.env`

### Webhook no recibe notificaciones

**Solución:**

1. Verifica que la URL del webhook sea accesible públicamente
2. Para desarrollo local usa ngrok o similar
3. Revisa que la URL esté configurada en tu app de Mercado Pago
4. Verifica los logs del webhook

### Pagos en estado "pending" indefinidamente

**Causas comunes:**

- Pago con efectivo (tarda hasta 3 días)
- Pago con transferencia bancaria
- Revisión manual de Mercado Pago

**Solución:**

- Consulta el estado del pago en el panel de Mercado Pago
- Implementa recordatorios automáticos

### Error de CORS en desarrollo

```typescript
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: "/api/mercadopago/:path*",
                headers: [{ key: "Access-Control-Allow-Origin", value: "*" }]
            }
        ];
    }
};
```

---

## 🎯 Ejemplos Avanzados

### Suscripciones/Pagos Recurrentes

```typescript
const preference = await createPreference({
    items: [
        {
            title: "Plan Premium - Mensual",
            quantity: 1,
            unit_price: 999
        }
    ],
    auto_return: "approved",
    back_urls: {
        success: `${baseUrl}/subscription/success`
    },
    metadata: {
        subscription: true,
        plan: "premium",
        interval: "monthly"
    }
});
```

### Descuentos y Cupones

```typescript
const originalPrice = 1000;
const discount = 200;

const preference = await createPreference({
    items: [
        {
            title: "Producto con descuento",
            quantity: 1,
            unit_price: originalPrice - discount
        }
    ],
    metadata: {
        original_price: originalPrice,
        discount_applied: discount,
        coupon_code: "SUMMER20"
    }
});
```

### Split de Pagos (Marketplace)

```typescript
// Requiere configuración especial en Mercado Pago
const preference = await createPreference({
  items: [...],
  marketplace_fee: 50, // Comisión del marketplace
  application_id: 'YOUR_APP_ID',
});
```

---

## 📚 Recursos

### Documentación Oficial

- [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
- [Guía de Integración](https://www.mercadopago.com.ar/developers/es/docs)
- [API Reference](https://www.mercadopago.com.ar/developers/es/reference)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)

### Herramientas

- [Panel de Desarrolladores](https://www.mercadopago.com.ar/developers/panel)
- [Simulador de Pagos](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-integration)
- [Postman Collection](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/postman)

### Soporte

- [Centro de Ayuda](https://www.mercadopago.com.ar/ayuda)
- [Comunidad](https://www.mercadopago.com.ar/developers/es/support)
- [Status](https://status.mercadopago.com/)

---

## 🔒 Seguridad

### PCI DSS Compliance

Mercado Pago cumple con PCI DSS Level 1, el más alto nivel de certificación de seguridad de pagos.

### Recomendaciones

1. **Nunca** guardes datos de tarjetas en tu base de datos
2. Usa HTTPS en producción
3. Valida webhook signatures
4. Implementa rate limiting
5. Monitorea transacciones sospechosas

---

## 💡 Tips

### Optimizar Conversión

1. **Checkout Express** - Menos clicks, más conversiones
2. **Métodos de Pago** - Ofrece todos los disponibles
3. **Cuotas sin interés** - Aumenta ticket promedio
4. **Responsive** - Optimiza para móvil
5. **Loading States** - Feedback visual claro

### Testing en Producción

```typescript
// Variable de feature flag
const useSandbox = process.env.MERCADOPAGO_SANDBOX === "true";

const checkoutUrl = useSandbox ? preference.sandbox_init_point : preference.init_point;
```

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025  
**Licencia:** MIT  
**Autor:** Devanthos  
**Compatibilidad:** Next.js 14+, React 18+
