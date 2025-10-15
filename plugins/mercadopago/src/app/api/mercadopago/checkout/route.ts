import { NextRequest, NextResponse } from "next/server";
import { createPreference } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar datos requeridos
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ error: "Se requiere al menos un item" }, { status: 400 });
        }

        // Validar estructura de items
        for (const item of body.items) {
            if (!item.title || !item.quantity || !item.unit_price) {
                return NextResponse.json(
                    { error: "Cada item debe tener title, quantity y unit_price" },
                    { status: 400 }
                );
            }
        }

        // Crear preferencia en Mercado Pago
        const preference = await createPreference({
            items: body.items.map((item: any) => ({
                title: item.title,
                quantity: item.quantity,
                unit_price: item.unit_price,
                currency_id: item.currency_id || "ARS",
                description: item.description
            })),
            payer: body.payer,
            back_urls: body.back_urls,
            auto_return: body.auto_return,
            payment_methods: body.payment_methods,
            notification_url: body.notification_url,
            external_reference: body.external_reference,
            metadata: body.metadata
        });

        return NextResponse.json({
            id: preference.id,
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point
        });
    } catch (error) {
        console.error("Error en checkout:", error);
        return NextResponse.json(
            { error: "Error al crear la preferencia de pago" },
            { status: 500 }
        );
    }
}
