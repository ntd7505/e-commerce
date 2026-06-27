import { apiClient } from "../../../api/apiClient";
import type { ApiResponse } from "../../../types/api";
import type { CreateReviewRequest, ProductReviewResponse } from "./reviewTypes";

export async function createReview(payload: CreateReviewRequest): Promise<ProductReviewResponse> {
  const response = await apiClient.post<ApiResponse<ProductReviewResponse>>(
    "/api/v1/client/reviews",
    payload,
  );

  return response.data.data;
}