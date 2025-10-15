import { NextSeo } from "next-seo";

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    canonical?: string;
}

export function SEO({ title, description, image, canonical }: SEOProps) {
    return (
        <NextSeo
            title={title}
            description={description}
            canonical={canonical}
            openGraph={{
                title,
                description,
                images: image ? [{ url: image }] : []
            }}
            twitter={{
                cardType: "summary_large_image"
            }}
        />
    );
}
