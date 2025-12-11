# 🔌 Integraciones para Next.js

Esta carpeta contiene integraciones pre-configuradas que puedes agregar a tu proyecto Devanthos.

## Integraciones disponibles

| Integración        | Descripción                      | Documentación                       |
| ------------------ | -------------------------------- | ----------------------------------- |
| 💳 **mercadopago** | Pagos con Mercado Pago           | [Ver docs](./mercadopago/README.md) |
| 🔐 **auth**        | Autenticación con NextAuth.js v5 | [Ver docs](./auth/README.md)        |
| 🍃 **mongodb**     | Base de datos MongoDB            | [Ver docs](./mongodb/README.md)     |

## Cómo usar las integraciones

### 1. Copiar archivos

Cada integración tiene su propia estructura de archivos. Copia los archivos correspondientes a las rutas indicadas en su README.

### 2. Instalar dependencias

```bash
# Mercado Pago
npm install mercadopago

# Auth (NextAuth.js v5)
npm install next-auth@beta

# MongoDB
npm install mongodb
```

### 3. Configurar variables de entorno

Cada integración requiere variables de entorno específicas. Consulta el README de cada una para más detalles.

## Estructura de archivos

```
integrations/
├── mercadopago/
│   ├── README.md
│   ├── lib/
│   │   └── mercadopago.ts
│   ├── app/
│   │   └── api/
│   │       └── mercadopago/
│   │           ├── create-preference/
│   │           │   └── route.ts
│   │           └── webhook/
│   │               └── route.ts
│   └── components/
│       └── checkout-button.tsx
│
├── auth/
│   ├── README.md
│   ├── auth.ts
│   ├── middleware.ts
│   ├── app/
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts
│   └── components/
│       └── auth/
│           ├── auth-buttons.tsx
│           ├── login-form.tsx
│           └── session-provider.tsx
│
└── mongodb/
    ├── README.md
    ├── lib/
    │   ├── mongodb.ts
    │   └── models/
    │       └── user.ts
    └── app/
        └── api/
            ├── health/
            │   └── route.ts
            └── users/
                └── route.ts
```

## Próximas integraciones

- 📧 **Resend** - Envío de emails transaccionales
- 💾 **Prisma** - ORM para bases de datos SQL
- ☁️ **Cloudinary** - Gestión de imágenes en la nube
- 🔔 **Push Notifications** - Notificaciones push con OneSignal
- 📊 **Analytics** - Google Analytics / Plausible

## Contribuir

Si quieres agregar una nueva integración, sigue la estructura existente y crea un PR en el repositorio.

## Soporte

- 📖 Documentación: https://docs.devanthos.com
- 💬 Discord: https://discord.gg/devanthos
- 🐛 Issues: https://github.com/devanthos/create-devanthos-app/issues
