"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LoginButtonProps {
    provider?: "google" | "github" | "credentials";
    callbackUrl?: string;
    className?: string;
    children?: React.ReactNode;
}

export function LoginButton({
    provider = "google",
    callbackUrl = "/dashboard",
    className,
    children
}: LoginButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const providerLabels = {
        google: "Continuar con Google",
        github: "Continuar con GitHub",
        credentials: "Iniciar sesión"
    };

    return (
        <Button onClick={handleLogin} disabled={isLoading} className={className}>
            {isLoading ? "Cargando..." : children || providerLabels[provider]}
        </Button>
    );
}

interface LogoutButtonProps {
    callbackUrl?: string;
    className?: string;
    children?: React.ReactNode;
}

export function LogoutButton({ callbackUrl = "/", className, children }: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleLogout} disabled={isLoading} variant="outline" className={className}>
            {isLoading ? "Cerrando..." : children || "Cerrar sesión"}
        </Button>
    );
}

// Componente que muestra botones según el estado de autenticación
interface AuthButtonsProps {
    className?: string;
}

export function AuthButtons({ className }: AuthButtonsProps) {
    // Este componente debe usarse con SessionProvider
    return (
        <div className={className}>
            <LoginButton provider="google" className="mr-2" />
            <LoginButton provider="github" />
        </div>
    );
}
