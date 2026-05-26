import { AdminStatCard } from "../../../components/AdminStatCard";
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
            <AdminStatCard label="Total Orders" value={orders.length} />
            <AdminStatCard label="Pending" value={pending} />
            <AdminStatCard label="Processing" value={processing} />
            <AdminStatCard label="Delivered" value={delivered + shipping} helper={`${shipping} shipping`} />
        </div>
    );
}
