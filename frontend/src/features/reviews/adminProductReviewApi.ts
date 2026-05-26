import { publicClient } from "../../api/publicClient";
import type { ApiResponse } from "../../types/api";
import type { ProductReviewResponse } from "./adminProductReviewTypes";

export async function getProductReviews(productId: number): Promise<ProductReviewResponse[]> {
    const response = await publicClient.get<ApiResponse<ProductReviewResponse[]>>(
        `/api/v1/client/products/${productId}/reviews`
    );

    return response.data.data;
}
