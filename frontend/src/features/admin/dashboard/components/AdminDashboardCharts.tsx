import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminDashboardResponse } from "../adminDashboardApi";

interface AdminDashboardChartsProps {
  dashboard: AdminDashboardResponse;
}

export function AdminDashboardCharts({ dashboard }: AdminDashboardChartsProps) {
  const orderStats = [
    { name: "Chờ xử lý", value: dashboard.pendingOrders, color: "#f59e0b" },
    { name: "Hoàn tất", value: dashboard.completedOrders, color: "#22c55e" },
    { name: "Đã hủy", value: dashboard.cancelledOrders, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const productStats = dashboard.topProducts.slice(0, 5).map((product) => ({
    name: product.productName.length > 15 ? product.productName.substring(0, 15) + "..." : product.productName,
    revenue: product.revenue,
    quantity: product.quantitySold,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-md">
          <p className="mb-1 text-xs font-bold text-text">{data.name}</p>
          <p className="text-sm font-extrabold" style={{ color: data.color }}>{data.value} đơn</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 opacity-0 animate-fade-in-up lg:grid-cols-2" style={{ animationDelay: "250ms" }}>
      <section className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm min-w-0">
        <h3 className="mb-2 text-sm font-bold text-text">Trạng thái đơn hàng</h3>
        <p className="mb-6 text-xs text-muted">Phân bổ số lượng đơn hàng theo trạng thái.</p>
        <div className="h-[250px] w-full flex-1 min-w-0">
          {orderStats.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomPieTooltip} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {orderStats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
              <span className="text-xs font-medium text-text">{stat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm min-w-0">
        <h3 className="mb-2 text-sm font-bold text-text">Sản phẩm bán chạy</h3>
        <p className="mb-6 text-xs text-muted">Top 5 sản phẩm có doanh thu cao nhất.</p>
        <div className="h-[250px] w-full flex-1 min-w-0">
          {productStats.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productStats} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  formatter={(value) => [Number(value ?? 0).toLocaleString("vi-VN") + "đ", "Doanh thu"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
                  labelStyle={{ color: "#111827", marginBottom: "4px", fontSize: "12px", fontWeight: "bold" }}
                  itemStyle={{ color: "#2563eb", fontSize: "13px", fontWeight: "bold" }}
                />
                <Bar dataKey="revenue" fill="#2563eb" maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
