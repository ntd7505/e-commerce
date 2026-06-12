import { adminClient } from "../../../api/adminClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { CategoryRequest, CategoryResponse } from "./adminCategoryTypes";

export async function getCategories(): Promise<CategoryResponse[]> {
    const response = await adminClient.get<ApiResponse<CategoryResponse[]>>(
        "/api/v1/admin/categories/all"
    );
    return unwrapApiList(response.data.data);
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
    const response = await adminClient.get<ApiResponse<CategoryResponse>>(
        `/api/v1/admin/categories/${id}`
    );
    return response.data.data;
}

export async function createCategory(
    payload: CategoryRequest
): Promise<CategoryResponse> {
    const response = await adminClient.post<ApiResponse<CategoryResponse>>(
        "/api/v1/admin/categories",
        payload
    );
    return response.data.data;
}

export async function updateCategory(id: number, payload: CategoryRequest): Promise<CategoryResponse> {
    const response = await adminClient.patch<ApiResponse<CategoryResponse>>(
        `/api/v1/admin/categories/${id}`,
        payload
    );
    return response.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
    await adminClient.delete(`/api/v1/admin/categories/${id}`);
}  
