import { publicClient } from "../../api/publicClient";
import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../types/api";
import type {
    LoginCredentials,
    LoginResponse,
    RegisterCredentials,
    User
} from "./authTypes";

export async function signIn(payload: LoginCredentials): Promise<LoginResponse> {
    const response = await publicClient.post<ApiResponse<LoginResponse>>(
        "/api/v1/auth/login",
        payload
    );

    return response.data.data;
}

export async function registerUser(payload: RegisterCredentials): Promise<User> {
    const response = await publicClient.post<ApiResponse<User>>(
        "/api/v1/client/users",
        payload
    );

    return response.data.data;
}

export async function getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
        "/api/v1/client/users/me"
    );

    return response.data.data;
}

export async function logout(token: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>("/api/v1/auth/logout", { token });
}
