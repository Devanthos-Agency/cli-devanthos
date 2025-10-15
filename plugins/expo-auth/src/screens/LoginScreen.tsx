import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            alert("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Ingresar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40,
        textAlign: "center"
    },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600"
    }
});
