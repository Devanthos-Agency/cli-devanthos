"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Declarar el tipo global para MercadoPago
declare global {
    interface Window {
        MercadoPago: new (
            publicKey: string,
            options?: { locale: string }
        ) => {
            checkout: (options: {
                preference: { id: string };
                render: { container: string; label: string };
            }) => void;
        };
    }
}

interface CheckoutButtonProps {
    preferenceId: string;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: Error) => void;
    onPending?: (paymentId: string) => void;
    className?: string;
    label?: string;
}

export function CheckoutButton({
    preferenceId,
    onSuccess,
    onError,
    onPending,
    className,
    label = "Pagar con Mercado Pago"
}: CheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {
        // Cargar SDK de Mercado Pago
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;

        script.onload = () => {
            setSdkLoaded(true);
            setIsLoading(false);
        };

        script.onerror = () => {
            setIsLoading(false);
            onError?.(new Error("No se pudo cargar el SDK de Mercado Pago"));
        };

        document.body.appendChild(script);

        return () => {
            // Limpiar script al desmontar
            const existingScript = document.querySelector(
                'script[src="https://sdk.mercadopago.com/js/v2"]'
            );
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [onError]);

    useEffect(() => {
        // Verificar parámetros de retorno en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get("payment_id");
        const status = urlParams.get("status");

        if (paymentId && status) {
            switch (status) {
                case "approved":
                    onSuccess?.(paymentId);
                    break;
                case "pending":
                case "in_process":
                    onPending?.(paymentId);
                    break;
                default:
                    onError?.(new Error(`Pago con estado: ${status}`));
            }

            // Limpiar parámetros de la URL
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, [onSuccess, onError, onPending]);

    const handleCheckout = () => {
        if (!sdkLoaded || !window.MercadoPago) {
            onError?.(new Error("SDK de Mercado Pago no disponible"));
            return;
        }

        try {
            const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
                locale: "es-AR"
            });

            mp.checkout({
                preference: { id: preferenceId },
                render: {
                    container: ".cho-container",
                    label: label
                }
            });
        } catch (error) {
            onError?.(error instanceof Error ? error : new Error("Error al iniciar checkout"));
        }
    };

    if (isLoading) {
        return (
            <Button disabled className={className}>
                Cargando...
            </Button>
        );
    }

    return (
        <>
            <Button onClick={handleCheckout} className={className}>
                {label}
            </Button>
            <div className="cho-container" />
        </>
    );
}

// Componente alternativo para usar el botón nativo de Mercado Pago
interface MercadoPagoButtonProps {
    preferenceId: string;
    className?: string;
}

export function MercadoPagoButton({ preferenceId, className }: MercadoPagoButtonProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;

        script.onload = () => {
            const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
                locale: "es-AR"
            });

            mp.checkout({
                preference: { id: preferenceId },
                render: {
                    container: `#mp-button-${preferenceId}`,
                    label: "Pagar"
                }
            });

            setIsReady(true);
        };

        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector(
                'script[src="https://sdk.mercadopago.com/js/v2"]'
            );
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [preferenceId]);

    return (
        <div className={className}>
            {!isReady && <p className="text-sm text-muted-foreground">Cargando botón de pago...</p>}
            <div id={`mp-button-${preferenceId}`} />
        </div>
    );
}
