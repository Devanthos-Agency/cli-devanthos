import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Validar variables de entorno
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está definida en las variables de entorno");
}

// Configurar el cliente de Mercado Pago
export const mercadoPagoClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: {
        timeout: 5000
    }
});

// Instancias para trabajar con Mercado Pago
export const preferenceClient = new Preference(mercadoPagoClient);
export const paymentClient = new Payment(mercadoPagoClient);

// Tipos para TypeScript
export interface CheckoutItem {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
    description?: string;
}

export interface PayerInfo {
    email: string;
    name?: string;
    surname?: string;
    phone?: {
        area_code: string;
        number: string;
    };
    address?: {
        zip_code: string;
        street_name: string;
        street_number: number;
    };
}

export interface PreferenceData {
    items: CheckoutItem[];
    payer?: PayerInfo;
    back_urls?: {
        success?: string;
        failure?: string;
        pending?: string;
    };
    auto_return?: "approved" | "all";
    payment_methods?: {
        excluded_payment_methods?: Array<{ id: string }>;
        excluded_payment_types?: Array<{ id: string }>;
        installments?: number;
    };
    notification_url?: string;
    external_reference?: string;
    metadata?: Record<string, any>;
}

/**
 * Crea una preferencia de pago en Mercado Pago
 */
export async function createPreference(data: PreferenceData) {
    try {
        const preference = await preferenceClient.create({
            body: {
                items: data.items,
                payer: data.payer,
                back_urls: data.back_urls || {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`
                },
                auto_return: data.auto_return || "approved",
                payment_methods: data.payment_methods,
                notification_url: data.notification_url,
                external_reference: data.external_reference,
                metadata: data.metadata
            }
        });

        return preference;
    } catch (error) {
        console.error("Error al crear preferencia:", error);
        throw error;
    }
}

/**
 * Obtiene información de un pago
 */
export async function getPayment(paymentId: string) {
    try {
        const payment = await paymentClient.get({ id: paymentId });
        return payment;
    } catch (error) {
        console.error("Error al obtener pago:", error);
        throw error;
    }
}

/**
 * Formatea el precio para mostrar
 */
export function formatPrice(amount: number, currency: string = "ARS"): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currency
    }).format(amount);
}
