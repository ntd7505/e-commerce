import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";

import type {
    ProductCreateRequest,
    ProductResponse,
} from "./adminProductTypes";

export async function createProduct(
    payload: ProductCreateRequest
): Promise<ProductResponse> {
    const response = await adminClient.post<ApiResponse<ProductResponse>>(
        "/api/v1/admin/products",
        payload
    );

    return response.data.data;
}
