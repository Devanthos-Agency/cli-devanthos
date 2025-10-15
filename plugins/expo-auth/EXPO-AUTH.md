# 🔐📱 Plugin Expo Auth - Devanthos

Sistema de autenticación completo para aplicaciones Expo y React Native.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Navegación Protegida](#navegación-protegida)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

- ✅ **SecureStore**: Almacenamiento seguro de tokens
- ✅ **Context API**: Estado global de autenticación
- ✅ **TypeScript**: Completamente tipado
- ✅ **React Native**: Compatible con iOS y Android
- ✅ **Expo**: Integración completa con Expo
- ✅ **Login Screen**: Pantalla de login lista para usar
- ✅ **Auto-login**: Persistencia de sesión

---

## 📦 Instalación

```bash
npx expo install expo-auth-session expo-crypto expo-secure-store expo-web-browser react-native-safe-area-context
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env`:

```env
API_URL=https://tu-api.com
```

### 2. Configurar AuthProvider

Envuelve tu aplicación con el `AuthProvider`:

```tsx
// App.tsx
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./navigation";

export default function App() {
    return (
        <AuthProvider>
            <Navigation />
        </AuthProvider>
    );
}
```

### 3. Actualizar URLs del API

Abre `context/AuthContext.tsx` y actualiza las URLs:

```typescript
// Reemplaza 'https://tu-api.com' con tu backend real
const response = await fetch("https://TU-API-AQUI.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
});
```

---

## 🚀 Uso

### Pantalla de Login

El plugin ya incluye una pantalla de login completa. Solo impórtala:

```tsx
import LoginScreen from "./screens/LoginScreen";

export default function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
```

### Usar Auth en Componentes

```tsx
import { useAuth } from "./context/AuthContext";
import { View, Text, Button } from "react-native";

export default function ProfileScreen() {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Text>No autenticado</Text>;
    }

    return (
        <View>
            <Text>Bienvenido, {user?.name}</Text>
            <Text>Email: {user?.email}</Text>
            <Button title="Cerrar Sesión" onPress={logout} />
        </View>
    );
}
```

### Navegación Condicional

```tsx
import { useAuth } from "./context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
```

---

## 📚 API Reference

### useAuth Hook

```typescript
const {
    user, // User | null - Usuario actual
    loading, // boolean - Estado de carga inicial
    login, // (email: string, password: string) => Promise<void>
    logout, // () => Promise<void>
    isAuthenticated // boolean - ¿Usuario autenticado?
} = useAuth();
```

### User Interface

```typescript
interface User {
    id: string;
    email: string;
    name: string;
}
```

### Métodos

#### login()

```typescript
const handleLogin = async () => {
    try {
        await login("user@example.com", "password123");
        // Usuario autenticado, navegar a home
    } catch (error) {
        Alert.alert("Error", "Credenciales inválidas");
    }
};
```

#### logout()

```typescript
const handleLogout = async () => {
    await logout();
    // Usuario desautenticado, navegar a login
};
```

---

## 🛡️ Navegación Protegida

### Con React Navigation

```tsx
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function ProtectedScreen({ navigation }) {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigation.replace("Login");
        }
    }, [isAuthenticated]);

    return <View>{/* Contenido protegido */}</View>;
}
```

### Hook Personalizado

```typescript
// hooks/useProtectedRoute.ts
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
    }
  }, [isAuthenticated]);
}

// Uso
function ProfileScreen() {
  useProtectedRoute();

  return <View>{/* ... */}</View>;
}
```

---

## 📊 Best Practices

### 1. Manejo de Errores

```typescript
const handleLogin = async () => {
    try {
        setLoading(true);
        await login(email, password);
    } catch (error) {
        if (error.message === "Login failed") {
            Alert.alert("Error", "Credenciales incorrectas");
        } else if (error.message === "Network request failed") {
            Alert.alert("Error", "Sin conexión a internet");
        } else {
            Alert.alert("Error", "Algo salió mal");
        }
    } finally {
        setLoading(false);
    }
};
```

### 2. Validación de Formularios

```typescript
const handleLogin = async () => {
    // Validar email
    if (!email || !email.includes("@")) {
        Alert.alert("Error", "Email inválido");
        return;
    }

    // Validar contraseña
    if (!password || password.length < 6) {
        Alert.alert("Error", "Contraseña debe tener mínimo 6 caracteres");
        return;
    }

    await login(email, password);
};
```

### 3. Loading States

```tsx
import { ActivityIndicator, View } from "react-native";

function MyApp() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Navigation />;
}
```

### 4. Refresh Token

```typescript
// Extender AuthContext para manejar refresh tokens
const refreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");

    if (!refreshToken) return;

    const response = await fetch("https://api.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
        const { token } = await response.json();
        await SecureStore.setItemAsync("auth_token", token);
    }
};
```

---

## 🔧 Troubleshooting

### SecureStore no funciona

```bash
# Reinstala expo-secure-store
npx expo install expo-secure-store

# Limpia cache
npx expo start -c
```

### Error de red al hacer login

```typescript
// Verifica la URL del API
console.log('API URL:', 'https://tu-api.com/auth/login');

// Prueba con curl
curl -X POST https://tu-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Usuario no persiste al cerrar app

```typescript
// Asegúrate de que checkAuth() se llame en useEffect
useEffect(() => {
    checkAuth();
}, []);

// Y que el token se guarde correctamente
await SecureStore.setItemAsync("auth_token", token);
```

### Tipo de error con SecureStore

```bash
# Instala tipos
npm install --save-dev @types/react @types/react-native
```

---

## 🎯 Ejemplos Avanzados

### Registro de Usuarios

```tsx
// screens/RegisterScreen.tsx
export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const response = await fetch("https://api.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            Alert.alert("Éxito", "Usuario creado");
            // Auto-login o navegar a login
        }
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Nombre" value={name} onChangeText={setName} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Registrarse" onPress={handleRegister} />
        </View>
    );
}
```

### Recuperación de Contraseña

```tsx
export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");

    const handleResetPassword = async () => {
        const response = await fetch("https://api.com/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            Alert.alert("Éxito", "Revisa tu email para resetear tu contraseña");
        }
    };

    return (
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <Button title="Resetear Contraseña" onPress={handleResetPassword} />
        </View>
    );
}
```

### OAuth (Google, Facebook)

```typescript
import * as AuthSession from "expo-auth-session";

const handleGoogleLogin = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const result = await AuthSession.startAsync({
        authUrl: `https://api.com/auth/google?redirect_uri=${redirectUri}`
    });

    if (result.type === "success") {
        const { token } = result.params;
        await SecureStore.setItemAsync("auth_token", token);
    }
};
```

---

## 📚 Recursos

- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow/)
- [React Native Best Practices](https://github.com/nearform/react-native-best-practices)

---

**Versión:** 1.0.0  
**Licencia:** MIT  
**Autor:** Devanthos
