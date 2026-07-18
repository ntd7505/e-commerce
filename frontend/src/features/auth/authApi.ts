import { publicClient } from "../../api/publicClient";
import { apiClient } from "../../api/apiClient";
import type { ApiResponse } from "../../types/api";
import type {
    LoginCredentials,
    LoginResponse,
    RegisterCredentials,
    User,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
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

export async function updateMe(payload: { fullName: string; phoneNumber: string; avatarUrl?: string }): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
        "/api/v1/client/users/me",
        payload
    );

    return response.data.data;
}

export async function logout(token: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>("/api/v1/auth/logout", { token });
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.patch<ApiResponse<void>>(
        "/api/v1/client/users/me/password",
        payload
    );
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await publicClient.post<ApiResponse<void>>(
        "/api/v1/auth/forgot-password",
        payload
    );
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await publicClient.post<ApiResponse<void>>(
        "/api/v1/auth/reset-password",
        payload
    );
}
