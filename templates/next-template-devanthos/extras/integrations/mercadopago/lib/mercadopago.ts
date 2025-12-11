import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
});

// Tipos para las preferencias
export interface PreferenceItem {
    title: string;
    unit_price: number;
    quantity: number;
    currency_id?: string;
    description?: string;
    picture_url?: string;
    category_id?: string;
}

export interface PreferencePayer {
    email: string;
    name?: string;
    surname?: string;
    phone?: {
        area_code: string;
        number: string;
    };
    address?: {
        street_name: string;
        street_number: number;
        zip_code: string;
    };
}

export interface CreatePreferenceParams {
    items: PreferenceItem[];
    payer?: PreferencePayer;
    external_reference?: string;
    notification_url?: string;
    back_urls?: {
        success: string;
        failure: string;
        pending: string;
    };
    auto_return?: "approved" | "all";
    expires?: boolean;
    expiration_date_from?: string;
    expiration_date_to?: string;
}

/**
 * Crear una preferencia de pago en Mercado Pago
 */
export async function createPreference(params: CreatePreferenceParams) {
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preferenceData = {
        items: params.items.map(item => ({
            id: crypto.randomUUID(),
            title: item.title,
            unit_price: item.unit_price,
            quantity: item.quantity,
            currency_id: item.currency_id || "ARS",
            description: item.description,
            picture_url: item.picture_url,
            category_id: item.category_id
        })),
        payer: params.payer,
        external_reference: params.external_reference,
        notification_url: params.notification_url || `${baseUrl}/api/mercadopago/webhook`,
        back_urls: params.back_urls || {
            success: `${baseUrl}/checkout/success`,
            failure: `${baseUrl}/checkout/failure`,
            pending: `${baseUrl}/checkout/pending`
        },
        auto_return: params.auto_return || "approved"
    };

    try {
        const result = await preference.create({ body: preferenceData });
        return {
            success: true,
            preferenceId: result.id,
            initPoint: result.init_point,
            sandboxInitPoint: result.sandbox_init_point
        };
    } catch (error) {
        console.error("Error al crear preferencia:", error);
        throw new Error("No se pudo crear la preferencia de pago");
    }
}

/**
 * Obtener información de un pago por ID
 */
export async function getPayment(paymentId: string) {
    const payment = new Payment(client);

    try {
        const result = await payment.get({ id: paymentId });
        return {
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
            transaction_amount: result.transaction_amount,
            currency_id: result.currency_id,
            payer: result.payer,
            external_reference: result.external_reference,
            date_created: result.date_created,
            date_approved: result.date_approved
        };
    } catch (error) {
        console.error("Error al obtener pago:", error);
        throw new Error("No se pudo obtener información del pago");
    }
}

/**
 * Verificar si el pago fue aprobado
 */
export function isPaymentApproved(status: string): boolean {
    return status === "approved";
}

/**
 * Obtener mensaje legible del estado del pago
 */
export function getPaymentStatusMessage(status: string): string {
    const messages: Record<string, string> = {
        approved: "Pago aprobado",
        pending: "Pago pendiente",
        authorized: "Pago autorizado",
        in_process: "Pago en proceso",
        in_mediation: "Pago en mediación",
        rejected: "Pago rechazado",
        cancelled: "Pago cancelado",
        refunded: "Pago reembolsado",
        charged_back: "Contracargo"
    };

    return messages[status] || "Estado desconocido";
}
