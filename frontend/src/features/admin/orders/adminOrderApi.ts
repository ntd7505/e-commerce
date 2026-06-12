import { adminClient } from "../../../api/adminClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { OrderResponse } from "./adminOrderTypes";

export async function getOrders(): Promise<OrderResponse[]> {
    const response = await adminClient.get<ApiResponse<OrderResponse[]>>(
        "/api/v1/admin/orders/all"
    );

    return unwrapApiList(response.data.data);
}

export async function getOrderById(orderId: number): Promise<OrderResponse> {
    const response = await adminClient.get<ApiResponse<OrderResponse>>(
        `/api/v1/admin/orders/${orderId}`
    );

    return response.data.data;
}

export async function confirmOrder(orderId: number): Promise<OrderResponse> {
    const response = await adminClient.post<ApiResponse<OrderResponse>>(
        `/api/v1/admin/orders/${orderId}/confirmations`
    );

    return response.data.data;
}

export async function processOrder(orderId: number): Promise<OrderResponse> {
    const response = await adminClient.post<ApiResponse<OrderResponse>>(
        `/api/v1/admin/orders/${orderId}/processing-events`
    );

    return response.data.data;
}

export async function shipOrder(orderId: number): Promise<OrderResponse> {
    const response = await adminClient.post<ApiResponse<OrderResponse>>(
        `/api/v1/admin/orders/${orderId}/shipments`
    );

    return response.data.data;
}

export async function deliverOrder(orderId: number): Promise<OrderResponse> {
    const response = await adminClient.post<ApiResponse<OrderResponse>>(
        `/api/v1/admin/orders/${orderId}/deliveries`
    );

    return response.data.data;
}
