export type ReviewMediaType = "IMAGE" | "VIDEO";

export type ProductReviewMediaRequest = {
  url: string;
  mediaType: ReviewMediaType;
  sortOrder: number;
};

export type ProductReviewMediaResponse = {
  id: number;
  url: string;
  mediaType: ReviewMediaType;
  sortOrder: number;
};

export type CreateReviewRequest = {
  orderItemId: number;
  rating: number;
  title: string | null;
  content: string | null;
  anonymous: boolean;
  media: ProductReviewMediaRequest[];
};

export type ReviewUserResponse = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
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
  productSlug?: string;
  thumbnailUrl?: string;
  variantName: string | null;
  sku: string | null;
  media: ProductReviewMediaResponse[];
  verifiedPurchase: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
};