import { apiClient } from "../../../api/apiClient";
import type { ApiResponse } from "../../../types/api";
import type { OrderResponse } from "../orders/adminOrderTypes";

export type AdminTopProductResponse = {
  productId: number;
  productName: string;
  thumbnailUrl?: string | null;
  quantitySold: number;
  revenue: number;
};

export type AdminDashboardResponse = {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  totalReviews: number;
  averageRating: number;
  recentOrders: OrderResponse[];
  topProducts: AdminTopProductResponse[];
};

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await apiClient.get<ApiResponse<AdminDashboardResponse>>(
    "/api/v1/admin/dashboard"
  );

  return response.data.data;
}
