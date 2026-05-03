import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";

import type {
    ProductCreateRequest,
    ProductMediaRequest,
    ProductMediaResponse,
    ProductMediaUpdateRequest,
    ProductResponse,
    ProductUpdateRequest,
    ProductVariantRequest,
    ProductVariantResponse,
    ProductVariantUpdateRequest,
} from "./adminProductTypes";

export async function getProducts(): Promise<ProductResponse[]> {
    const response = await adminClient.get<ApiResponse<ProductResponse[]>>(
        "/api/v1/admin/products"
    );

    return response.data.data;
}

export async function getProductById(id: number): Promise<ProductResponse> {
    const response = await adminClient.get<ApiResponse<ProductResponse>>(
        `/api/v1/admin/products/${id}`
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

export async function toggleProductStatus(id: number): Promise<ProductResponse> {
    const response = await adminClient.patch<ApiResponse<ProductResponse>>(
        `/api/v1/admin/products/${id}/status`
    );

    return response.data.data;
}

export async function updateProduct(
    id: number,
    payload: ProductUpdateRequest
): Promise<ProductResponse> {
    const response = await adminClient.put<ApiResponse<ProductResponse>>(
        `/api/v1/admin/products/${id}`,
        payload
    );

    return response.data.data;
}

export async function addProductVariant(
    productId: number,
    payload: ProductVariantRequest
): Promise<ProductVariantResponse> {
    const response = await adminClient.post<ApiResponse<ProductVariantResponse>>(
        `/api/v1/admin/products/${productId}/variants`,
        payload
    );

    return response.data.data;
}

export async function getProductVariantById(id: number): Promise<ProductVariantResponse> {
    const response = await adminClient.get<ApiResponse<ProductVariantResponse>>(
        `/api/v1/admin/products/variants/${id}`
    );

    return response.data.data;
}

export async function updateProductVariant(
    id: number,
    payload: ProductVariantUpdateRequest
): Promise<ProductVariantResponse> {
    const response = await adminClient.put<ApiResponse<ProductVariantResponse>>(
        `/api/v1/admin/products/variants/${id}`,
        payload
    );

    return response.data.data;
}

export async function toggleProductVariantStatus(id: number): Promise<ProductVariantResponse> {
    const response = await adminClient.patch<ApiResponse<ProductVariantResponse>>(
        `/api/v1/admin/products/variants/${id}/status`
    );

    return response.data.data;
}

export async function deleteProductVariant(id: number): Promise<void> {
    await adminClient.delete(`/api/v1/admin/products/variants/${id}`);
}

export async function createProductMedia(
    productId: number,
    payload: ProductMediaRequest
): Promise<ProductMediaResponse> {
    const response = await adminClient.post<ApiResponse<ProductMediaResponse>>(
        `/api/v1/admin/products/${productId}/media`,
        payload
    );

    return response.data.data;
}

export async function updateProductMedia(
    mediaId: number,
    payload: ProductMediaUpdateRequest
): Promise<ProductMediaResponse> {
    const response = await adminClient.put<ApiResponse<ProductMediaResponse>>(
        `/api/v1/admin/products/media/${mediaId}`,
        payload
    );

    return response.data.data;
}

export async function deleteProductMedia(mediaId: number): Promise<void> {
    await adminClient.delete(`/api/v1/admin/products/media/${mediaId}`);
}
