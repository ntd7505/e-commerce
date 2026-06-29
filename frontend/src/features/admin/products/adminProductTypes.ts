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

export type ProductVariantRequest = {
    variantName: string;
    stockQuantity: number;
    price: number;
    salePrice: number;
    currency: string;
};

export type ProductVariantUpdateRequest = {
    variantName?: string;
    stockQuantity?: number;
    price?: number;
    salePrice?: number;
    currency?: string;
    active?: boolean;
};

export type ProductMediaRequest = {
    url: string;
    mediaType: string;
    thumbnail: boolean;
    sortOrder: number;
    altText?: string;
};

export type ProductMediaUpdateRequest = {
    url?: string;
    mediaType?: string;
    thumbnail?: boolean;
    sortOrder?: number;
    altText?: string;
    active?: boolean;
};

export type ProductUpdateRequest = {
    name?: string;
    shortDescription?: string;
    description?: string;
    brandId?: number;
    categoryId?: number;
    active?: boolean;
};

export type ProductSummary = {
    id: number;
    name: string;
    slug: string;
};

export type ProductDescriptionBlockType = "TEXT" | "IMAGE" | "TEXT_IMAGE";

export type ProductDescriptionBlockResponse = {
    id: number;
    type: ProductDescriptionBlockType;
    title?: string | null;
    content?: string | null;
    imageUrl?: string | null;
    altText?: string | null;
    sortOrder: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type ProductSpecificationResponse = {
    id: number;
    groupName?: string | null;
    specKey: string;
    specValue: string;
    sortOrder: number;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type ProductDescriptionBlockRequest = Omit<ProductDescriptionBlockResponse, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductSpecificationRequest = Omit<ProductSpecificationResponse, 'id' | 'createdAt' | 'updatedAt'>;

export type ProductVariantResponse = {
    id: number;
    variantName: string;
    stockQuantity: number;
    price: number;
    salePrice: number;
    currency: string;
    sku: string;
    active: boolean;
};

export type ProductMediaResponse = {
    id: number;
    url: string;
    mediaType: string;
    thumbnail: boolean;
    sortOrder: number;
    altText: string | null;
    active: boolean;
};

export type ProductResponse = {
    id: number;
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    brand: ProductSummary | null;
    category: ProductSummary | null;
    active: boolean;
    variants: ProductVariantResponse[];
    media: ProductMediaResponse[];
    descriptionBlocks?: ProductDescriptionBlockResponse[];
    specifications?: ProductSpecificationResponse[];
    createdAt: string;
};
