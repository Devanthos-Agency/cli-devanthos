import { NextRequest, NextResponse } from "next/server";
import { createPreference, type PreferenceItem, type PreferencePayer } from "@/lib/mercadopago";

interface CreatePreferenceBody {
    items: PreferenceItem[];
    payer?: PreferencePayer;
    external_reference?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: CreatePreferenceBody = await request.json();

        // Validar items
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: "Se requiere al menos un item" }, { status: 400 });
        }

        // Validar cada item
        for (const item of body.items) {
            if (!item.title || !item.unit_price || !item.quantity) {
                return NextResponse.json(
                    { error: "Cada item debe tener title, unit_price y quantity" },
                    { status: 400 }
                );
            }

            if (item.unit_price <= 0) {
                return NextResponse.json(
                    { error: "El precio debe ser mayor a 0" },
                    { status: 400 }
                );
            }

            if (item.quantity <= 0) {
                return NextResponse.json(
                    { error: "La cantidad debe ser mayor a 0" },
                    { status: 400 }
                );
            }
        }

        const result = await createPreference({
            items: body.items,
            payer: body.payer,
            external_reference: body.external_reference
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error en create-preference:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
