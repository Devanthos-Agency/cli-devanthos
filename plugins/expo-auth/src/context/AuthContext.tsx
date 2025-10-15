import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await SecureStore.getItemAsync("auth_token");
            if (token) {
                // Verificar token con tu API
                const response = await fetch("https://tu-api.com/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    await SecureStore.deleteItemAsync("auth_token");
                }
            }
        } catch (error) {
            console.error("Error checking auth:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("https://tu-api.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const { token, user: userData } = await response.json();
            await SecureStore.setItemAsync("auth_token", token);
            setUser(userData);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("auth_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
