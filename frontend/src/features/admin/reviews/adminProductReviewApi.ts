import { apiClient } from "../../../api/apiClient";
import { unwrapApiList, type ApiResponse, type PageResponse } from "../../../types/api";
import type { ProductReviewResponse } from "./adminProductReviewTypes";

export type ReviewModerationRequest = {
    active: boolean;
};

export async function getProductReviews(): Promise<ProductReviewResponse[]> {
    const response = await apiClient.get<
        ApiResponse<ProductReviewResponse[] | PageResponse<ProductReviewResponse> | null>
    >("/api/v1/admin/product-reviews");

    return unwrapApiList(response.data.data);
}

export async function moderateProductReview(
    reviewId: number,
    payload: ReviewModerationRequest
): Promise<ProductReviewResponse> {
    const response = await apiClient.patch<ApiResponse<ProductReviewResponse>>(
        `/api/v1/admin/product-reviews/${reviewId}/moderation`,
        payload
    );

    return response.data.data;
}

export async function deleteProductReview(reviewId: number): Promise<void> {
    await apiClient.delete(`/api/v1/admin/product-reviews/${reviewId}`);
}
