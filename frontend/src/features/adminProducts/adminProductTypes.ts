export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
}

export type ProductCreateRequest = {
    name: string;
    shortDescription?: string;
    description?: string;
    brandId: number;
    categoryId: number;
    active: boolean;
    variants: {
        variantName: string;
        stockQuantity: number;
        price: number;
        salePrice: number;
        currency: string;
    }[];
    media?: {
        url: string;
        mediaType: string;
        thumbnail: boolean;
        sortOrder: number;
        altText?: string;
    }[];
}
export type ProductResponse = {
    id: number;
    name: string;
    slug: string;
    active: boolean;
};