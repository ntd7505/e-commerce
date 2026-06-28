import { useEffect, useState } from "react";
import {
  DollarSign, Package, ShoppingCart, Users, ArrowUpRight, Clock,
  LayoutGrid, Award, Ticket, MessageSquare
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { AdminSpinner } from "../../../../components/admin/AdminSpinner";
import { getProducts } from "../../products/adminProductApi";
import { getAdminUsers } from "../../customers/adminUserApi";
import { getOrders } from "../../orders/adminOrderApi";
import { getBrands } from "../../brands/adminBrandApi";
import { getCategories } from "../../categories/adminCategoryApi";
import type { OrderResponse } from "../../orders/adminOrderTypes";
import { OrderStatusBadge } from "../../orders/components/OrderStatusBadge";

type DashboardMetrics = {
  products: number;
  activeProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  users: number;
  orders: number;
  revenue: number;
  paidOrders: number;
  brands: number;
  categories: number;
};

type RevenueDataPoint = { date: string; revenue: number };

type StatusDataPoint = { name: string; value: number; color: string };

const emptyMetrics: DashboardMetrics = {
  products: 0, activeProducts: 0, inStockProducts: 0, outOfStockProducts: 0,
  users: 0, orders: 0, revenue: 0, paidOrders: 0, brands: 0, categories: 0,
};

function formatMoney(value: number) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M ?";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K ?";
  return value.toLocaleString("vi-VN") + " ?";
}

function formatMoneyFull(value: number) {
  return value.toLocaleString("vi-VN") + " ?";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

/**
 * Build daily revenue chart data from paid orders.
 * Source: GET /api/v1/admin/orders (client-side aggregation by createdAt date).
 * Falls back to order.totalAmount when payment.amount is unavailable.
 */
function buildRevenueData(orders: OrderResponse[]): RevenueDataPoint[] {
  const map = new Map<string, number>();
  orders
    .filter((o) => o.paymentStatus === "PAID")
    .forEach((o) => {
      const day = o.createdAt.slice(0, 10); // YYYY-MM-DD
      map.set(day, (map.get(day) ?? 0) + (o.payment?.amount ?? o.totalAmount));
    });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14) // last 14 days
    .map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      revenue,
    }));
}

/**
 * Build order status distribution for the donut chart.
 * Source: GET /api/v1/admin/orders (client-side count by status field).
 */
function buildStatusData(orders: OrderResponse[]): StatusDataPoint[] {
  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    PROCESSING: "#8b5cf6",
    SHIPPING: "#06b6d4",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
    RETURNED: "#f97316",
    COMPLETED: "#22c55e",
  };
  const map = new Map<string, number>();
  orders.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1));
  return Array.from(map.entries())
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: statusColors[status] ?? "#94a3b8",
    }));
}

const QUICK_LINKS = [
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid, color: "bg-violet-50 text-violet-600" },
  { label: "Brands", href: "/admin/brands", icon: Award, color: "bg-primary-soft text-primary" },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, color: "bg-warning-soft text-warning" },
  { label: "Reviews", href: "/admin/products/reviews", icon: MessageSquare, color: "bg-pink-50 text-pink-600" },
];

export default function AdminDashboardSummary() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [statusData, setStatusData] = useState<StatusDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Dashboard data sources (all real API):
     * - Products:  GET /api/v1/admin/products   ? total, active, stock
     * - Users:     GET /api/v1/admin/users       ? total
     * - Orders:    GET /api/v1/admin/orders      ? total, revenue, status distribution, recent
     * - Brands:    GET /api/v1/admin/brands      ? total
     * - Categories: GET /api/v1/admin/categories ? total
     *
     * Charts are computed client-side from the full orders list.
     * No dedicated /statistics or /dashboard-summary endpoint exists yet.
     * Features needing backend aggregation (best sellers, growth %, geo) are marked as Pending API.
     */
    async function loadMetrics() {
      try {
        const [products, users, orders, brands, categories] = await Promise.all([
          getProducts(), getAdminUsers(), getOrders(), getBrands(), getCategories(),
        ]);

        const paidOrdersList = orders.filter((o) => o.paymentStatus === "PAID");
        const revenue = paidOrdersList.reduce(
          (acc, order) => acc + (order.payment?.amount ?? order.totalAmount), 0
        );

        const stockMap = new Map<number, number>();
        products.forEach((product) => {
          (product.variants ?? []).forEach((variant) => {
            stockMap.set(product.id, (stockMap.get(product.id) ?? 0) + (variant.stockQuantity ?? 0));
          });
        });
        const inStockProducts = Array.from(stockMap.values()).filter((qty) => qty > 0).length;
        const outOfStockProducts = Array.from(stockMap.values()).filter((qty) => qty <= 0).length;

        setMetrics({
          products: products.length,
          activeProducts: products.filter((p) => p.active).length,
          inStockProducts,
          outOfStockProducts,
          users: users.length,
          orders: orders.length,
          revenue,
          paidOrders: paidOrdersList.length,
          brands: brands.length,
          categories: categories.length,
        });

        setRecentOrders(orders.slice(0, 5));
        setRevenueData(buildRevenueData(orders));
        setStatusData(buildStatusData(orders));
        setError("");
      } catch (requestError) {
        console.error("Failed to load dashboard metrics:", requestError);
        setError("Không th? t?i s? li?u dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const cards = [
    {
      label: "Total Revenue",
      value: loading ? "—" : formatMoneyFull(metrics.revenue),
      icon: DollarSign,
      detail: `${metrics.paidOrders} paid orders`,
      color: "text-success",
      bg: "bg-gradient-to-br from-success-soft to-emerald-100/60",
      iconBg: "bg-success-soft text-success",
    },
    {
      label: "Total Orders",
      value: loading ? "—" : metrics.orders,
      icon: ShoppingCart,
      detail: "Across all statuses",
      color: "text-primary",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/60",
      iconBg: "bg-primary-soft text-primary",
    },
    {
      label: "Products",
      value: loading ? "—" : metrics.products,
      icon: Package,
      detail: `${metrics.activeProducts} active · ${metrics.inStockProducts} in stock`,
      color: "text-violet-600",
      bg: "bg-gradient-to-br from-violet-50 to-violet-100/60",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      label: "Customers",
      value: loading ? "—" : metrics.users,
      icon: Users,
      detail: "Registered accounts",
      color: "text-warning",
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/60",
      iconBg: "bg-orange-100 text-warning",
    },
    {
      label: "Brands",
      value: loading ? "—" : metrics.brands,
      icon: Award,
      detail: "Registered brands",
      color: "text-sky-600",
      bg: "bg-gradient-to-br from-sky-50 to-sky-100/60",
      iconBg: "bg-sky-100 text-sky-600",
    },
    {
      label: "Categories",
      value: loading ? "—" : metrics.categories,
      icon: LayoutGrid,
      detail: "Product categories",
      color: "text-rose-600",
      bg: "bg-gradient-to-br from-rose-50 to-rose-100/60",
      iconBg: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-text">Dashboard</h2>
        <p className="mt-1 text-sm text-muted">T?ng quan tình hình kinh doanh và h? th?ng.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <article
            key={card.label}
            className={`rounded-2xl border border-border p-5 shadow-sm transition-all hover:shadow-md ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">{card.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-text">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{card.detail}</p>
          </article>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue bar chart */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-text">Doanh thu theo ngày</h3>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <AdminSpinner className="h-8 w-8" />
            </div>
          ) : revenueData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted">
              Chua có d? li?u doanh thu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => formatMoney(v)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  formatter={(value) => [formatMoneyFull(Number(value ?? 0)), "Doanh thu"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Order status donut */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-text">Tr?ng thái don hàng</h3>
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <AdminSpinner className="h-8 w-8" />
            </div>
          ) : statusData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [Number(value ?? 0), String(name)]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "#64748b" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      {/* Recent orders + Quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <section className="rounded-2xl border border-border bg-surface shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="text-sm font-bold text-text">Recent Orders</h3>
            <a
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-bold text-success transition-colors hover:text-success"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs font-semibold text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Order</th>
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold text-right">Total</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center">
                      <AdminSpinner className="mx-auto h-6 w-6" />
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-surface">
                      <td className="px-5 py-4 font-bold text-text">#{order.id}</td>
                      <td className="px-5 py-4 font-medium text-text">{order.recipientName}</td>
                      <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-success">
                        {formatMoneyFull(order.totalAmount)}
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

        {/* Quick links */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-text">Quick Access</h3>
          <div className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:border-success-soft hover:shadow-sm"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.color}`}>
                  <link.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-text">{link.label}</span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted" />
              </a>
            ))}
          </div>

          {/* Revenue summary */}
          <div className="mt-5 rounded-xl border border-success-soft bg-gradient-to-br from-success-soft to-success-soft/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-success">
              Total Revenue
            </p>
            <p className="mt-2 text-xl font-extrabold text-success">
              {loading ? "—" : formatMoneyFull(metrics.revenue)}
            </p>
            <p className="mt-1 text-xs text-success">{metrics.paidOrders} paid orders</p>
          </div>

          {/* Pending: needs dedicated backend endpoints */}
          <div className="mt-5 rounded-xl border border-dashed border-warning-soft bg-warning-soft/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warning">
              <Clock className="h-3.5 w-3.5" />
              Backend needed
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-warning">
              <li>· GET /api/v1/admin/statistics/revenue</li>
              <li>· GET /api/v1/admin/statistics/top-products</li>
              <li>· GET /api/v1/admin/statistics/geo</li>
              <li>· GET /api/v1/admin/statistics/aov</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
