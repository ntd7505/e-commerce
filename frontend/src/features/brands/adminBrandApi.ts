import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";
import type { BrandCreateRequest, BrandRequest, BrandResponse, BrandStatusUpdateRequest } from "./adminBrandTypes";

export async function getBrands(): Promise<BrandResponse[]> {
    const response = await adminClient.get<ApiResponse<BrandResponse[]>>(
        "/api/v1/admin/brands"
    );

    return response.data.data;
}

export async function getBrandById(id: number): Promise<BrandResponse> {
    const response = await adminClient.get<ApiResponse<BrandResponse>>(
        `/api/v1/admin/brands/${id}`
    );

    return response.data.data;
}

export async function getDeletedBrands(): Promise<BrandResponse[]> {
    const response = await adminClient.get<ApiResponse<BrandResponse[]>>(
        "/api/v1/admin/brands/deleted"
    );

    return response.data.data;
}

export async function createBrand(payload: BrandCreateRequest): Promise<BrandResponse> {
    const response = await adminClient.post<ApiResponse<BrandResponse>>(
        "/api/v1/admin/brands",
        payload
    );
    return response.data.data;

}

export async function updateBrand(id: number, payload: BrandRequest): Promise<BrandResponse> {
    const response = await adminClient.put<ApiResponse<BrandResponse>>(
        `/api/v1/admin/brands/${id}`,
        payload
    );

    return response.data.data;
}

export async function updateBrandStatus(
    id: number,
    payload: BrandStatusUpdateRequest
): Promise<BrandResponse> {
    const response = await adminClient.patch<ApiResponse<BrandResponse>>(
        `/api/v1/admin/brands/${id}/status`,
        payload
    );

    return response.data.data;
}

export async function deleteBrand(id: number): Promise<void> {
    await adminClient.delete(`/api/v1/admin/brands/${id}`);
}
