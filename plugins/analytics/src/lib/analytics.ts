/**
 * Google Analytics Helper
 *
 * Funciones para trackear eventos personalizados
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const pageview = (url: string) => {
    if (typeof window.gtag !== "undefined") {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
            page_path: url
        });
    }
};

export const event = ({
    action,
    category,
    label,
    value
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window.gtag !== "undefined") {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};
