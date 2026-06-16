import { publicClient } from "../../../api/publicClient";
import { unwrapApiList, type ApiResponse, type PageResponse } from "../../../types/api";

export interface BrandSummaryResponse {
  id: number;
  name: string;
  slug: string;
}

export interface CategorySummaryResponse {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariantResponse {
  id: number;
  variantName: string;
  stockQuantity: number;
  price: number;
  salePrice: number;
  currency: string;
  sku: string;
  active: boolean;
}

export interface ProductMediaResponse {
  id: number;
  url: string;
  mediaType: string;
  thumbnail: boolean;
  sortOrder: number;
  altText: string;
  active: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  brand: BrandSummaryResponse;
  category: CategorySummaryResponse;
  active: boolean;
  variants: ProductVariantResponse[];
  media: ProductMediaResponse[];
  createdAt: string; 
}

export interface ProductParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
  brandId?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ReviewSummaryResponse {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
}

export interface ProductReviewResponse {
  id: number;
  productId: number;
  orderItemId: number;
  rating: number;
  title: string;
  content: string;
  anonymous: boolean;
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  } | null;
  productName: string;
  variantName: string;
  sku: string;
  createdAt: string;
  media: {
    id: number;
    url: string;
    mediaType: "IMAGE" | "VIDEO";
    sortOrder: number;
  }[];
}

export const clientProductApi = {
  getProductsPageable: async (params: ProductParams = {}): Promise<PageResponse<ProductResponse>> => {
    const response = await publicClient.get<ApiResponse<PageResponse<ProductResponse>>>('/api/v1/client/products', { params });
    return response.data.data;
  },

  getProductDetail: async (slug: string): Promise<ProductResponse> => {
    const response = await publicClient.get<ApiResponse<ProductResponse>>(`/api/v1/client/products/${slug}`);
    return response.data.data;
  },

  getRelatedProducts: async (slug: string): Promise<ProductResponse[]> => {
    const response = await publicClient.get<ApiResponse<ProductResponse[] | PageResponse<ProductResponse>>>(`/api/v1/client/products/${slug}/related`);
    return unwrapApiList(response.data.data);
  },

  getCategories: async (): Promise<CategorySummaryResponse[]> => {
    const response = await publicClient.get<ApiResponse<CategorySummaryResponse[]>>('/api/v1/client/categories');
    return response.data.data;
  },

  getBrands: async (): Promise<BrandSummaryResponse[]> => {
    const response = await publicClient.get<ApiResponse<BrandSummaryResponse[]>>('/api/v1/client/brands');
    return response.data.data;
  },

  getProductReviews: async (productId: number, page: number = 0, size: number = 10): Promise<ProductReviewResponse[]> => {
    const response = await publicClient.get<ApiResponse<ProductReviewResponse[] | PageResponse<ProductReviewResponse>>>(`/api/v1/client/products/${productId}/reviews`, {
      params: { page, size }
    });
    return unwrapApiList(response.data.data);
  },

  getProductReviewSummary: async (productId: number): Promise<ReviewSummaryResponse> => {
    const response = await publicClient.get<ApiResponse<ReviewSummaryResponse>>(`/api/v1/client/products/${productId}/review-summary`);
    return response.data.data;
  }
};
