import { apiClient } from "../../../api/apiClient";
import type { ApiResponse } from "../../../types/api";
import type { PermissionResponse, RoleCreateRequest, RoleResponse } from "./adminRoleTypes";

export async function getRoles(): Promise<RoleResponse[]> {
  const response = await apiClient.get<ApiResponse<RoleResponse[] | null>>(
    "/api/v1/admin/roles"
  );

  return response.data.data ?? [];
}

export async function createRole(payload: RoleCreateRequest): Promise<RoleResponse> {
  const response = await apiClient.post<ApiResponse<RoleResponse>>(
    "/api/v1/admin/roles",
    payload
  );

  return response.data.data;
}

export async function getPermissions(): Promise<PermissionResponse[]> {
  const response = await apiClient.get<ApiResponse<PermissionResponse[] | null>>(
    "/api/v1/admin/permissions"
  );

  return response.data.data ?? [];
}
