import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";

import type {
    ProductCreateRequest,
    ProductResponse,
} from "./adminProductTypes";

export async function getProducts(): Promise<ProductResponse[]> {
    const response = await adminClient.get<ApiResponse<ProductResponse[]>>(
        "/api/v1/admin/products"
    );

    return response.data.data;
}

export async function createProduct(
    payload: ProductCreateRequest
): Promise<ProductResponse> {
    const response = await adminClient.post<ApiResponse<ProductResponse>>(
        "/api/v1/admin/products",
        payload
    );

    return response.data.data;
}
