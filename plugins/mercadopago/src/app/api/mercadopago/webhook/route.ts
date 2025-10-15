import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/mercadopago";

/**
 * Webhook para recibir notificaciones de Mercado Pago
 * Configurar en: https://www.mercadopago.com.ar/developers/panel/app
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("Webhook de Mercado Pago recibido:", body);

        // Mercado Pago envía el tipo de notificación
        const { type, data } = body;

        // Solo procesamos notificaciones de pagos
        if (type === "payment") {
            const paymentId = data.id;

            // Obtener información completa del pago
            const payment = await getPayment(paymentId);

            console.log("Información del pago:", {
                id: payment.id,
                status: payment.status,
                status_detail: payment.status_detail,
                transaction_amount: payment.transaction_amount,
                external_reference: payment.external_reference
            });

            // Aquí puedes procesar el pago según su estado
            switch (payment.status) {
                case "approved":
                    // Pago aprobado - actualizar base de datos, enviar email, etc.
                    console.log("✅ Pago aprobado:", paymentId);
                    // TODO: Implementar lógica de negocio
                    break;

                case "pending":
                    // Pago pendiente
                    console.log("⏳ Pago pendiente:", paymentId);
                    // TODO: Implementar lógica de negocio
                    break;

                case "rejected":
                    // Pago rechazado
                    console.log("❌ Pago rechazado:", paymentId);
                    // TODO: Implementar lógica de negocio
                    break;

                case "refunded":
                    // Pago reembolsado
                    console.log("💰 Pago reembolsado:", paymentId);
                    // TODO: Implementar lógica de negocio
                    break;

                case "cancelled":
                    // Pago cancelado
                    console.log("🚫 Pago cancelado:", paymentId);
                    // TODO: Implementar lógica de negocio
                    break;

                default:
                    console.log("Estado desconocido:", payment.status);
            }

            // Guardar en base de datos (ejemplo con Prisma)
            /*
      await prisma.payment.upsert({
        where: { mercadoPagoId: paymentId },
        update: {
          status: payment.status,
          statusDetail: payment.status_detail,
          updatedAt: new Date(),
        },
        create: {
          mercadoPagoId: paymentId,
          status: payment.status,
          statusDetail: payment.status_detail,
          amount: payment.transaction_amount,
          externalReference: payment.external_reference,
        },
      });
      */
        }

        // Responder 200 OK para confirmar recepción
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error en webhook:", error);
        // Aún así responder 200 para evitar reintentos
        return NextResponse.json({ received: false }, { status: 200 });
    }
}

/**
 * GET para verificar que el endpoint está activo
 */
export async function GET() {
    return NextResponse.json({
        message: "Webhook de Mercado Pago activo",
        timestamp: new Date().toISOString()
    });
}
