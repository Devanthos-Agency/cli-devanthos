/**
 * @devanthos/plugin-stripe
 *
 * Plugin para integración de pagos con Stripe
 */

export default {
    name: "@devanthos/plugin-stripe",
    version: "1.0.0",
    description: "Agrega integración de pagos con Stripe",

    async afterClone({ _projectName, framework }) {
        console.log(`💳 [Stripe Plugin] Configurando Stripe para ${framework}...`);
    },

    dependencies: {
        next: ["stripe", "@stripe/stripe-js", "@stripe/react-stripe-js"]
    },

    files: {
        next: [
            {
                path: "lib/stripe.ts",
                content: `import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY no está definida');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
`
            },
            {
                path: "app/api/checkout/route.ts",
                content: `import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price * 100, // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: \`\${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${req.headers.get('origin')}/cancel\`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`
            },
            {
                path: "app/api/webhook/route.ts",
                content: `import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Pago completado:', session.id);
      // Aquí guardar en DB, enviar email, etc.
      break;
    
    case 'payment_intent.succeeded':
      console.log('Payment Intent succeeded');
      break;

    default:
      console.log(\`Evento no manejado: \${event.type}\`);
  }

  return NextResponse.json({ received: true });
}
`
            },
            {
                path: "components/CheckoutButton.tsx",
                content: `'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: Array<{
    name: string;
    description: string;
    price: number;
    quantity: number;
  }>;
}

export function CheckoutButton({ items }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
    >
      {loading ? 'Procesando...' : 'Pagar con Stripe'}
    </button>
  );
}
`
            }
        ]
    },

    postInstall: {
        message: "💳 Stripe configurado. Configura las claves API en variables de entorno.",
        envVars: [
            "STRIPE_SECRET_KEY",
            "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
            "STRIPE_WEBHOOK_SECRET"
        ],
        instructions: [
            "1. Obtén tus claves en: https://dashboard.stripe.com/apikeys",
            "2. Configura el webhook en: https://dashboard.stripe.com/webhooks",
            "3. Usa la URL: https://tu-dominio.com/api/webhook",
            "4. Eventos recomendados: checkout.session.completed, payment_intent.succeeded"
        ]
    }
};
