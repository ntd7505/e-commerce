import { apiClient } from "../../../api/apiClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { OrderCancelRequestResponse } from "./adminOrderCancelTypes";

export async function getOrderCancelRequests(): Promise<OrderCancelRequestResponse[]> {
    const response = await apiClient.get<ApiResponse<OrderCancelRequestResponse[]>>(
        "/api/v1/admin/order-cancel-requests/all"
    );

    return unwrapApiList(response.data.data);
}

export async function approveOrderCancelRequest(requestId: number): Promise<OrderCancelRequestResponse> {
    const response = await apiClient.post<ApiResponse<OrderCancelRequestResponse>>(
        `/api/v1/admin/order-cancel-requests/${requestId}/approvals`
    );

    return response.data.data;
}

export async function rejectOrderCancelRequest(requestId: number): Promise<OrderCancelRequestResponse> {
    const response = await apiClient.post<ApiResponse<OrderCancelRequestResponse>>(
        `/api/v1/admin/order-cancel-requests/${requestId}/rejections`
    );

    return response.data.data;
}
