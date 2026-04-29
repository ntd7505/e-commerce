import { adminClient } from "../../api/adminClient";
import type { ApiResponse } from "../../types/api";
import type {
    LoginCredentials,
    LoginResponse
} from "./authTypes";
export async function signIn(payload: LoginCredentials): Promise<LoginResponse> {
    const response = await adminClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload
    );

    return response.data.data;
}

