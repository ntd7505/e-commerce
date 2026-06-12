import { publicClient } from "../../../api/publicClient";
import { type ApiResponse, type PageResponse, unwrapApiList } from "../../../types/api";

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
  createdAt: string; // LocalDateTime từ Java trả về thường là string (ISO format)
}

export const clientProductApi = {
  getProductsPageable: async (page: number = 0, size: number = 10): Promise<ProductResponse[]> => {
    const response = await publicClient.get<ApiResponse<PageResponse<ProductResponse>>>('/api/v1/client/products', {
      params: { page, size }
    });
    return unwrapApiList(response.data.data);
  },

  getProductDetail: async (id: number): Promise<ProductResponse> => {
    const response = await publicClient.get<ApiResponse<ProductResponse>>(`/api/v1/public/products/${id}`);
    return response.data.data;
  }
};
