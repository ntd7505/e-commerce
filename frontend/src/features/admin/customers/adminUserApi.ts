import { apiClient } from "../../../api/apiClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { AdminUserResponse, UserStatus } from "./adminUserTypes";

export async function getAdminUsers(): Promise<AdminUserResponse[]> {
  const response = await apiClient.get<ApiResponse<AdminUserResponse[]>>(
    "/api/v1/admin/users/all"
  );

  return unwrapApiList(response.data.data);
}

export async function getCurrentAdminUser(): Promise<AdminUserResponse> {
  const response = await apiClient.get<ApiResponse<AdminUserResponse>>(
    "/api/v1/admin/users/me"
  );

  return response.data.data;
}

export async function getAdminUserById(id: number): Promise<AdminUserResponse> {
  const response = await apiClient.get<ApiResponse<AdminUserResponse>>(
    `/api/v1/admin/users/${id}`
  );

  return response.data.data;
}

export async function updateAdminUserStatus(
  id: number,
  status: UserStatus
): Promise<AdminUserResponse> {
  const response = await apiClient.patch<ApiResponse<AdminUserResponse>>(
    `/api/v1/admin/users/${id}/status`,
    { status }
  );

  return response.data.data;
}
