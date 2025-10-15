"use client";

import { CheckoutButton } from "./CheckoutButton";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    currency?: string;
}

export function ProductCard({
    id,
    title,
    description,
    price,
    image,
    currency = "ARS"
}: ProductCardProps) {
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: currency
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {image && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>

                    <CheckoutButton
                        items={[
                            {
                                title,
                                quantity: 1,
                                unit_price: price,
                                description
                            }
                        ]}
                        buttonText="Comprar"
                        className="text-sm px-4 py-2"
                    />
                </div>
            </div>
        </div>
    );
}
