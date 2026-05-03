import type { ProductResponse } from "./adminProductTypes";

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
});

export function getProductThumbnail(product: ProductResponse) {
    return product.media.find((item) => item.thumbnail && item.active)?.url
        ?? product.media.find((item) => item.active)?.url
        ?? "";
}

export function getPrimaryVariant(product: ProductResponse) {
    return product.variants.find((variant) => variant.active) ?? product.variants[0];
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
