"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

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
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items })
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            if (stripe) {
                await stripe.redirectToCheckout({ sessionId });
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al procesar el pago");
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
            {loading ? "Procesando..." : "Pagar con Stripe"}
        </button>
    );
}
