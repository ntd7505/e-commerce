import { apiClient } from "../../../api/apiClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { CategoryRequest, CategoryResponse } from "./adminCategoryTypes";

export async function getCategories(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<ApiResponse<CategoryResponse[]>>(
        "/api/v1/admin/categories/all"
    );
    return unwrapApiList(response.data.data);
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
    const response = await apiClient.get<ApiResponse<CategoryResponse>>(
        `/api/v1/admin/categories/${id}`
    );
    return response.data.data;
}

export async function createCategory(
    payload: CategoryRequest
): Promise<CategoryResponse> {
    const response = await apiClient.post<ApiResponse<CategoryResponse>>(
        "/api/v1/admin/categories",
        payload
    );
    return response.data.data;
}

export async function updateCategory(id: number, payload: CategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.patch<ApiResponse<CategoryResponse>>(
        `/api/v1/admin/categories/${id}`,
        payload
    );
    return response.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/admin/categories/${id}`);
}  
