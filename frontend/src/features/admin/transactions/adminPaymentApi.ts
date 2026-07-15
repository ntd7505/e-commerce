import { apiClient as api } from "../../../api/apiClient";
import type { PageResponse } from "../../../types/api";

export interface PaymentResponse {
  id: number;
  orderId: number;
  method: string;
  status: string;
  amount: number;
  transactionCode: string | null;
  bankCode: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  transferContent: string | null;
  qrCodeUrl: string | null;
  paidAt: string | null;
  createdAt: string;
}

export async function getPayments(params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<PageResponse<PaymentResponse>> {
  const defaultParams = { page: 0, size: 1000, ...params };
  const { data } = await api.get("/api/v1/admin/payments", { params: defaultParams });
  
  if (data?.data?.content) {
    return data.data;
  }
  if (data?.content) {
    return data;
  }
  return { 
    content: [], 
    totalElements: 0, 
    totalPages: 0, 
    size: defaultParams.size, 
    page: defaultParams.page,
    first: true,
    last: true
  };
}

export async function getPaymentById(id: number): Promise<PaymentResponse> {
  const { data } = await api.get(`/api/v1/admin/payments/${id}`);
  return data.data;
}

export async function updatePaymentStatus(id: number, status: string): Promise<PaymentResponse> {
  const { data } = await api.patch(`/api/v1/admin/payments/${id}/status`, { status });
  return data.data;
}
