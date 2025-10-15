import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Manejar eventos
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            console.log("Pago completado:", session.id);
            // Aquí guardar en DB, enviar email, etc.
            break;

        case "payment_intent.succeeded":
            console.log("Payment Intent succeeded");
            break;

        default:
            console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
