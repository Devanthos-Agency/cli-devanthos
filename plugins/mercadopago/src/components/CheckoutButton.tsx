"use client";

import { useState } from "react";

interface CheckoutItem {
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
}

interface CheckoutButtonProps {
    items: CheckoutItem[];
    buttonText?: string;
    className?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function CheckoutButton({
    items,
    buttonText = "Pagar con Mercado Pago",
    className = "",
    onSuccess,
    onError
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/mercadopago/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items })
            });

            if (!response.ok) {
                throw new Error("Error al crear la preferencia de pago");
            }

            const data = await response.json();

            // Redirigir al checkout de Mercado Pago
            // En producción usa init_point, en desarrollo usa sandbox_init_point
            const checkoutUrl =
                process.env.NODE_ENV === "production"
                    ? data.init_point
                    : data.sandbox_init_point || data.init_point;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                onSuccess?.();
            } else {
                throw new Error("No se recibió URL de checkout");
            }
        } catch (error) {
            console.error("Error al procesar checkout:", error);
            onError?.(error as Error);
            alert("Error al procesar el pago. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className={`
        inline-flex items-center justify-center
        px-6 py-3
        bg-[#009ee3] hover:bg-[#0089cc]
        text-white font-semibold
        rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Procesando...
                </>
            ) : (
                <>
                    <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {buttonText}
                </>
            )}
        </button>
    );
}
