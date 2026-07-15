import { AdminStatCard } from "../../../../components/admin/AdminStatCard";
import type { OrderResponse } from "../adminOrderTypes";

type OrderStatsProps = {
    orders: OrderResponse[];
};

export function OrderStats({ orders }: OrderStatsProps) {
    const pending = orders.filter((order) => order.status === "PENDING").length;
    const processing = orders.filter((order) => order.status === "PROCESSING").length;
    const shipping = orders.filter((order) => order.status === "SHIPPING").length;
    const delivered = orders.filter((order) => order.status === "DELIVERED" || order.status === "COMPLETED").length;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <AdminStatCard label="Tổng đơn hàng" value={orders.length} />
            <AdminStatCard label="Chờ xác nhận" value={pending} />
            <AdminStatCard label="Đang xử lý" value={processing} />
            <AdminStatCard label="Đã giao hàng" value={delivered + shipping} helper={`${shipping} đang giao`} />
        </div>
    );
}
