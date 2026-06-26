import { publicClient } from "../../../api/publicClient";
import { unwrapApiList, type ApiResponse, type PageResponse } from "../../../types/api";
import type { ProductReviewResponse } from "./adminProductReviewTypes";

export async function getProductReviews(productId: number): Promise<ProductReviewResponse[]> {
    const response = await publicClient.get<
        ApiResponse<ProductReviewResponse[] | PageResponse<ProductReviewResponse> | null>
    >(`/api/v1/client/products/${productId}/reviews`);

    return unwrapApiList(response.data.data);
}