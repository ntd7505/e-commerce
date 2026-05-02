import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";
import type { BrandCreateRequest, BrandResponse } from "./adminBrandTypes";

export async function getBrands(): Promise<BrandResponse[]> {
    const response = await adminClient.get<ApiResponse<BrandResponse[]>>(
        "/api/v1/admin/brands"
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