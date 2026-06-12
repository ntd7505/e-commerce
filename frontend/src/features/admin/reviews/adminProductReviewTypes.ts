export type ReviewUserResponse = {
    id: number;
    fullName: string;
    avatarUrl: string | null;
};

export type ProductReviewMediaResponse = {
    id: number;
    url: string;
    mediaType: "IMAGE" | "VIDEO";
    sortOrder: number;
};

export type ProductReviewResponse = {
    id: number;
    productId: number;
    orderItemId: number;
    rating: number;
    title: string | null;
    content: string | null;
    anonymous: boolean;
    user: ReviewUserResponse | null;
    productName: string;
    variantName: string | null;
    sku: string | null;
    media: ProductReviewMediaResponse[];
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
};
