import { Eye, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AdminEmptyState } from "../../../../components/admin/AdminEmptyState";
import { AdminSkeletonTable } from "../../../../components/admin/AdminSkeletonTable";
import { Button } from "../../../../components/common";
import type { OrderResponse, OrderStatus } from "../adminOrderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrdersTableProps = {
    orders: OrderResponse[];
    loading: boolean;
    error: string;
    actionOrderId: number | null;
    onView: (orderId: number) => void;
    onAction: (orderId: number, action: "CONFIRM" | "PROCESS" | "SHIP" | "DELIVER") => void;
};

const orderStatusFilters: Array<{ label: string; value: "ALL" | OrderStatus }> = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao", value: "DELIVERED" },
];

function formatMoney(value: number) {
    return value.toLocaleString("vi-VN");
}

function formatDate(value: string) {
    return new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getNextAction(order: OrderResponse): { label: string; action: "CONFIRM" | "PROCESS" | "SHIP" | "DELIVER" } | null {
    if (order.status === "PENDING") {
        return { label: "Xác nhận", action: "CONFIRM" };
    }

    if (order.status === "CONFIRMED") {
        return { label: "Xử lý", action: "PROCESS" };
    }

    if (order.status === "PROCESSING") {
        return { label: "Giao hàng", action: "SHIP" };
    }

    if (order.status === "SHIPPING") {
        return { label: "Đã giao", action: "DELIVER" };
    }

    return null;
}

export function OrdersTable({
    orders,
    loading,
    error,
    actionOrderId,
    onView,
    onAction,
}: OrdersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

    const filteredOrders = orders.filter((order) => {
        const keyword = searchTerm.toLowerCase();
        const matchesKeyword =
            String(order.id).includes(keyword) ||
            order.recipientName.toLowerCase().includes(keyword) ||
            order.phoneNumber.toLowerCase().includes(keyword);

        if (!matchesKeyword) {
            return false;
        }

        if (statusFilter !== "ALL") {
            return order.status === statusFilter;
        }

        return true;
    });

    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "ALL";

    function clearFilters() {
        setSearchTerm("");
        setStatusFilter("ALL");
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-5">
                <div>
                    <h3 className="font-bold text-text">Danh sách đơn hàng</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">
                        Hiển thị {filteredOrders.length}/{orders.length} đơn hàng
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
                        {orderStatusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                    statusFilter === option.value
                                        ? "bg-surface-alt text-primary shadow-sm"
                                        : "text-muted hover:text-text"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm kiếm mã, tên, SĐT"
                            className="w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-9 pr-3 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            {loading && <AdminSkeletonTable columns={8} rows={4} />}
            {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
            {!loading && !error && filteredOrders.length === 0 && (
                <AdminEmptyState
                    icon={ShoppingBag}
                    title="Không tìm thấy đơn hàng"
                    description="Các đơn hàng sẽ hiển thị ở đây."
                    compact
                />
            )}

            {!loading && !error && filteredOrders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] text-left text-sm">
                        <thead className="bg-surface-alt text-xs font-bold uppercase tracking-wider text-muted border-b border-border">
                            <tr>
                                <th className="px-5 py-3">Mã đơn</th>
                                <th className="px-5 py-3">Khách hàng</th>
                                <th className="px-5 py-3">Tổng tiền</th>
                                <th className="px-5 py-3">Trạng thái</th>
                                <th className="px-5 py-3">Thanh toán</th>
                                <th className="px-5 py-3">Vận chuyển</th>
                                <th className="px-5 py-3">Ngày tạo</th>
                                <th className="px-5 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredOrders.map((order) => {
                                const nextAction = getNextAction(order);
                                const busy = actionOrderId === order.id;

                                return (
                                    <tr key={order.id}>
                                        <td className="px-5 py-4 font-bold text-text">#{order.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.userAvatarUrl ? (
                                                    <img 
                                                        src={order.userAvatarUrl} 
                                                        alt={order.recipientName} 
                                                        className="h-8 w-8 rounded-full object-cover shrink-0" 
                                                    />
                                                ) : (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-xs font-bold text-success shrink-0">
                                                        {((order.recipientName || "?")[0] || "?").toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-text">{order.recipientName}</p>
                                                    <p className="mt-1 text-xs text-muted">{order.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-text">
                                            {formatMoney(order.totalAmount)}
                                        </td>
                                        <td className="px-5 py-4"><OrderStatusBadge value={order.status} /></td>
                                        <td className="px-5 py-4"><OrderStatusBadge value={order.paymentStatus} /></td>
                                        <td className="px-5 py-4"><OrderStatusBadge value={order.shippingStatus} /></td>
                                        <td className="px-5 py-4 text-muted">{formatDate(order.createdAt)}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => onView(order.id)}
                                                    leftIcon={<Eye className="h-4 w-4" />}
                                                    title="Xem chi tiết"
                                                />

                                                {nextAction && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => onAction(order.id, nextAction.action)}
                                                        disabled={busy}
                                                        loading={busy}
                                                    >
                                                        {nextAction.label}
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
