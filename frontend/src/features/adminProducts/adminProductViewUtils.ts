import type { ProductResponse } from "./adminProductTypes";

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
});

export function getProductThumbnail(product: ProductResponse) {
    const media = product.media ?? [];

    return media.find((item) => item.thumbnail && item.active)?.url
        ?? media.find((item) => item.active)?.url
        ?? "";
}

export function getPrimaryVariant(product: ProductResponse) {
    const variants = product.variants ?? [];

    return variants.find((variant) => variant.active) ?? variants[0];
}

export function formatProductDate(value: string) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}
