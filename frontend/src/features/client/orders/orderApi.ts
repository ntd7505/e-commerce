import { apiClient } from "../../../api/apiClient";
import type { ApiResponse, PageResponse } from "../../../types/api";
import type { Order, OrderListParams } from "./orderTypes";

export type OrderPage = PageResponse<Order>;

export async function getOrders(params: OrderListParams = {}): Promise<OrderPage> {
  const query: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 10,
    sortBy: params.sortBy ?? "createdAt",
    sortDir: params.sortDir ?? "desc",
  };

  const response = await apiClient.get<ApiResponse<OrderPage>>("/api/v1/client/orders", {
    params: query,
  });

  return response.data.data;
}

export async function getOrderById(orderId: number | string): Promise<Order> {
  const response = await apiClient.get<ApiResponse<Order>>(
    `/api/v1/client/orders/${orderId}`,
  );

  return response.data.data;
}

export async function cancelOrder(orderId: number, reason: string): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>(
    `/api/v1/client/orders/${orderId}/cancellations`,
    { reason },
  );

  return response.data.data;
}

export async function requestCancelOrder(orderId: number, reason: string): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>(
    `/api/v1/client/orders/${orderId}/cancellation-requests`,
    { reason },
  );

  return response.data.data;
}

export async function confirmReceipt(orderId: number): Promise<Order> {
  const response = await apiClient.post<ApiResponse<Order>>(
    `/api/v1/client/orders/${orderId}/receipts`,
  );

  return response.data.data;
}
