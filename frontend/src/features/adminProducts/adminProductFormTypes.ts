import type { ProductMediaResponse, ProductVariantResponse } from "./adminProductTypes";

export type ProductCreateFormValues = {
    name: string;
    shortDescription: string;
    description: string;
    brandId: string;
    categoryId: string;
    variantName: string;
    price: string;
    salePrice: string;
    stockQuantity: string;
    imageUrl: string;
    mediaUrls: string[];
};

export type VariantDraft = {
    id?: number;
    variantName: string;
    stockQuantity: string;
    price: string;
    salePrice: string;
    currency: string;
    active: boolean;
};

export type MediaDraft = {
    id?: number;
    url: string;
    mediaType: string;
    thumbnail: boolean;
    sortOrder: string;
    altText: string;
    active: boolean;
};

export const emptyFormValues: ProductCreateFormValues = {
    name: "",
    shortDescription: "",
    description: "",
    brandId: "",
    categoryId: "",
    variantName: "Default",
    price: "",
    salePrice: "",
    stockQuantity: "",
    imageUrl: "",
    mediaUrls: [""],
};

export const emptyVariant: VariantDraft = {
    variantName: "",
    stockQuantity: "0",
    price: "",
    salePrice: "0",
    currency: "VND",
    active: true,
};

export const emptyMedia: MediaDraft = {
    url: "",
    mediaType: "image",
    thumbnail: false,
    sortOrder: "0",
    altText: "",
    active: true,
};

export function variantToDraft(variant: ProductVariantResponse): VariantDraft {
    return {
        id: variant.id,
        variantName: variant.variantName,
        stockQuantity: String(variant.stockQuantity),
        price: String(variant.price),
        salePrice: String(variant.salePrice),
        currency: variant.currency,
        active: variant.active,
    };
}

export function mediaToDraft(media: ProductMediaResponse): MediaDraft {
    return {
        id: media.id,
        url: media.url,
        mediaType: media.mediaType,
        thumbnail: media.thumbnail,
        sortOrder: String(media.sortOrder),
        altText: media.altText ?? "",
        active: media.active,
    };
}
