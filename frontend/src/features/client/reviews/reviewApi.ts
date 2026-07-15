import { apiClient } from "../../../api/apiClient";
import type { ApiResponse, PageResponse } from "../../../types/api";
import type { CreateReviewRequest, ProductReviewResponse } from "./reviewTypes";

export async function createReview(payload: CreateReviewRequest): Promise<ProductReviewResponse> {
  const response = await apiClient.post<ApiResponse<ProductReviewResponse>>(
    "/api/v1/client/reviews",
    payload,
  );

  return response.data.data;
}

export async function getMyReviews(params: { page?: number; size?: number } = {}): Promise<PageResponse<ProductReviewResponse>> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 10,
    sortDir: "desc"
  };

  const response = await apiClient.get<ApiResponse<PageResponse<ProductReviewResponse>>>(
    "/api/v1/client/reviews/me",
    { params: query }
  );

  return response.data.data;
}