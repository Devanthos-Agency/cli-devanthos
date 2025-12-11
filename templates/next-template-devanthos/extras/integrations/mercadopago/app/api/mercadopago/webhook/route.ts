import { NextRequest, NextResponse } from "next/server";
import { getPayment, isPaymentApproved } from "@/lib/mercadopago";

// Tipos de notificación de Mercado Pago
interface MercadoPagoNotification {
    id: string;
    live_mode: boolean;
    type: string;
    date_created: string;
    user_id: string;
    api_version: string;
    action: string;
    data: {
        id: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: MercadoPagoNotification = await request.json();

        console.log("📬 Webhook recibido:", {
            type: body.type,
            action: body.action,
            dataId: body.data?.id
        });

        // Solo procesar notificaciones de pago
        if (body.type === "payment") {
            const paymentId = body.data.id;

            try {
                const payment = await getPayment(paymentId);

                console.log("💰 Información del pago:", {
                    id: payment.id,
                    status: payment.status,
                    amount: payment.transaction_amount,
                    external_reference: payment.external_reference
                });

                // Procesar según el estado del pago
                if (isPaymentApproved(payment.status!)) {
                    // ✅ Pago aprobado - Actualizar tu base de datos, enviar email, etc.
                    await handleApprovedPayment(payment);
                } else if (payment.status === "pending") {
                    // ⏳ Pago pendiente
                    await handlePendingPayment(payment);
                } else if (payment.status === "rejected") {
                    // ❌ Pago rechazado
                    await handleRejectedPayment(payment);
                }
            } catch (paymentError) {
                console.error("Error al procesar pago:", paymentError);
                // Retornar 200 para que MP no reintente
            }
        }

        // Siempre retornar 200 para confirmar recepción
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error en webhook:", error);
        // Retornar 200 incluso en error para evitar reintentos
        return NextResponse.json({ received: true }, { status: 200 });
    }
}

// Handlers para diferentes estados de pago
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleApprovedPayment(payment: any) {
    // TODO: Implementar lógica de pago aprobado
    // Ejemplos:
    // - Actualizar estado de orden en base de datos
    // - Enviar email de confirmación
    // - Activar suscripción
    // - Generar factura
    console.log("✅ Procesando pago aprobado:", payment.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePendingPayment(payment: any) {
    // TODO: Implementar lógica de pago pendiente
    // Ejemplos:
    // - Marcar orden como "pendiente de pago"
    // - Enviar email con instrucciones
    console.log("⏳ Procesando pago pendiente:", payment.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRejectedPayment(payment: any) {
    // TODO: Implementar lógica de pago rechazado
    // Ejemplos:
    // - Notificar al usuario
    // - Liberar stock reservado
    console.log("❌ Procesando pago rechazado:", payment.id);
}
