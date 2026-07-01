import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Package,
  ShoppingCart,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { AdminSpinner } from "../../../../components/admin/AdminSpinner";
import { AdminStatCard } from "../../../../components/admin/AdminStatCard";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { getAdminDashboard, type AdminDashboardResponse } from "../adminDashboardApi";
import { OrderStatusBadge } from "../../orders/components/OrderStatusBadge";
import { AdminDashboardCharts } from "./AdminDashboardCharts";

function formatMoney(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString("vi-VN") + "đ";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const emptyDashboard: AdminDashboardResponse = {
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
  activeProducts: 0,
  totalCustomers: 0,
  totalReviews: 0,
  averageRating: 0,
  recentOrders: [],
  topProducts: [],
};

export default function AdminDashboardSummary() {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      setDashboard(await getAdminDashboard());
    } catch (requestError) {
      console.error("Failed to load admin dashboard:", requestError);
      setError("Không thể tải dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const cards = [
    {
      label: "Doanh thu",
      value: loading ? "—" : formatMoney(dashboard.totalRevenue),
      description: "Tổng doanh thu đơn hoàn tất",
      icon: DollarSign,
    },
    {
      label: "Tổng đơn hàng",
      value: loading ? "—" : dashboard.totalOrders,
      description: `${dashboard.pendingOrders} đơn chờ xử lý`,
      icon: ShoppingCart,
    },
    {
      label: "Đơn hoàn tất",
      value: loading ? "—" : dashboard.completedOrders,
      description: `${dashboard.cancelledOrders} đơn đã hủy`,
      icon: CheckCircle2,
    },
    {
      label: "Sản phẩm",
      value: loading ? "—" : dashboard.totalProducts,
      description: `${dashboard.activeProducts} sản phẩm đang bán`,
      icon: Package,
    },
    {
      label: "Khách hàng",
      value: loading ? "—" : dashboard.totalCustomers,
      description: "Tài khoản người dùng",
      icon: Users,
    },
    {
      label: "Đánh giá",
      value: loading ? "—" : dashboard.totalReviews,
      description: `Điểm trung bình ${Number(dashboard.averageRating ?? 0).toFixed(1)}/5`,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in opacity-0" style={{ animationDelay: '50ms' }}>
        <div>
          <h2 className="text-2xl font-bold text-text">Dashboard</h2>
          <p className="mt-1 text-sm text-muted">Tổng quan nhanh tình hình kinh doanh của NexaMart.</p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface-alt disabled:opacity-60"
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <div key={card.label} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${100 + index * 50}ms` }}>
            <AdminStatCard
              label={card.label}
              value={card.value}
              helper={card.description}
              icon={card.icon}
            />
          </div>
        ))}
      </div>

      {!loading && dashboard.totalOrders > 0 && (
        <AdminDashboardCharts dashboard={dashboard} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="animate-fade-in-up rounded-xl border border-border bg-surface shadow-sm lg:col-span-2 opacity-0" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="text-sm font-bold text-text">Đơn hàng gần đây</h3>
              <p className="mt-1 text-xs text-muted">Dữ liệu lấy từ API dashboard của backend.</p>
            </div>
            <a href="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-success">
              Xem tất cả <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-surface-alt text-xs font-semibold text-muted">
                <tr>
                  <th className="px-5 py-3">Mã đơn</th>
                  <th className="px-5 py-3">Người nhận</th>
                  <th className="px-5 py-3">Ngày đặt</th>
                  <th className="px-5 py-3 text-right">Tổng tiền</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center">
                      <AdminSpinner className="mx-auto h-6 w-6" />
                    </td>
                  </tr>
                ) : dashboard.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted">
                      Chưa có đơn hàng gần đây.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentOrders.map((order, index) => (
                    <tr key={order.id} className="animate-fade-in-up opacity-0 transition-colors hover:bg-surface-alt" style={{ animationDelay: `${350 + index * 40}ms` }}>
                      <td className="px-5 py-4 font-bold text-text">#{order.id}</td>
                      <td className="px-5 py-4 font-medium text-text">{order.recipientName ?? "-"}</td>
                      <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-success">
                        {formatMoney(order.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge value={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm opacity-0" style={{ animationDelay: '350ms' }}>
            <h3 className="text-sm font-bold text-text">Tình trạng đơn</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-warning-soft px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-warning">
                  <Clock className="h-4 w-4" /> Chờ xử lý
                </span>
                <span className="font-bold text-text">{dashboard.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-success-soft px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" /> Hoàn tất
                </span>
                <span className="font-bold text-text">{dashboard.completedOrders}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-danger-soft px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-danger">
                  <XCircle className="h-4 w-4" /> Đã hủy
                </span>
                <span className="font-bold text-text">{dashboard.cancelledOrders}</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm opacity-0" style={{ animationDelay: '400ms' }}>
            <h3 className="text-sm font-bold text-text">Sản phẩm bán chạy</h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <AdminSpinner className="h-6 w-6" />
              ) : dashboard.topProducts.length === 0 ? (
                <p className="text-sm text-muted">Chưa có dữ liệu sản phẩm bán chạy.</p>
              ) : (
                dashboard.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.productId} className="animate-fade-in-up flex items-center gap-3 rounded-xl border border-border p-3 opacity-0 transition-shadow hover:shadow-sm" style={{ animationDelay: `${450 + index * 50}ms` }}>
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
                      <AdminImage src={product.thumbnailUrl ?? ""} alt={product.productName} className="h-full w-full object-cover" fallbackClassName="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-text">{product.productName}</p>
                      <p className="text-xs text-muted">Đã bán {product.quantitySold}</p>
                    </div>
                    <p className="shrink-0 text-xs font-bold text-success">{formatMoney(product.revenue)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm opacity-0" style={{ animationDelay: '450ms' }}>
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <Star className="h-4 w-4 fill-warning text-warning" />
              Điểm đánh giá trung bình
            </div>
            <p className="mt-3 text-3xl font-extrabold text-text">
              {Number(dashboard.averageRating ?? 0).toFixed(1)}
              <span className="text-base font-bold text-muted"> / 5</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
