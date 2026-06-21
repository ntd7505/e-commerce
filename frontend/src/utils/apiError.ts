import { AxiosError } from "axios";
import type { ApiResponse } from "../types/api";

export interface ApiErrorDetail {
    message: string;
    details?: Record<string, string>;
}

export function parseApiError(error: unknown): ApiErrorDetail {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        if (axiosError.response?.data) {
            const data = axiosError.response.data;
            return {
                message: data.message || axiosError.message,
                details: data.error?.details
            };
        }
        return { message: axiosError.message };
    }
    
    if (error instanceof Error) {
        return { message: error.message };
    }
    
    return { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
}
