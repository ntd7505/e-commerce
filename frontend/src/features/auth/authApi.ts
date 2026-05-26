import { publicClient } from "../../api/publicClient";
import type { ApiResponse } from "../../types/api";
import type {
    LoginCredentials,
    LoginResponse
} from "./authTypes";
export async function signIn(payload: LoginCredentials): Promise<LoginResponse> {
    const response = await publicClient.post<ApiResponse<LoginResponse>>(
        "/api/v1/auth/login",
        payload
    );

    return response.data.data;
}

