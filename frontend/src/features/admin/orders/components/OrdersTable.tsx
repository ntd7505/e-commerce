import { Eye, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { AdminEmptyState } from "../../../../components/admin/AdminEmptyState";
import { AdminSkeletonTable } from "../../../../components/admin/AdminSkeletonTable";
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
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipping", value: "SHIPPING" },
    { label: "Delivered", value: "DELIVERED" },
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
        return { label: "Confirm", action: "CONFIRM" };
    }

    if (order.status === "CONFIRMED") {
        return { label: "Process", action: "PROCESS" };
    }

    if (order.status === "PROCESSING") {
        return { label: "Ship", action: "SHIP" };
    }

    if (order.status === "SHIPPING") {
        return { label: "Deliver", action: "DELIVER" };
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
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
                <div>
                    <h3 className="font-bold text-text">Order List</h3>
                    <p className="mt-1 text-xs font-medium text-muted">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1">
                        {orderStatusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                    statusFilter === option.value
                                        ? "bg-surface text-success shadow-sm"
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
                            placeholder="Search order, name, phone"
                            className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-success"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {loading && <AdminSkeletonTable columns={8} rows={4} />}
            {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
            {!loading && !error && filteredOrders.length === 0 && (
                <AdminEmptyState
                    icon={ShoppingBag}
                    title="No orders found"
                    description="Orders will appear here once placed."
                    compact
                />
            )}

            {!loading && !error && filteredOrders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] text-left text-sm">
                        <thead className="bg-surface text-xs uppercase text-muted">
                            <tr>
                                <th className="px-5 py-3">Order</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Order Status</th>
                                <th className="px-5 py-3">Payment</th>
                                <th className="px-5 py-3">Shipping</th>
                                <th className="px-5 py-3">Created</th>
                                <th className="px-5 py-3 text-right">Actions</th>
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
                                                <button
                                                    type="button"
                                                    onClick={() => onView(order.id)}
                                                    className="rounded-md p-2 text-muted transition-colors hover:bg-surface-alt"
                                                    aria-label="View order"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {nextAction && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onAction(order.id, nextAction.action)}
                                                        disabled={busy}
                                                        className="rounded-lg bg-success px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-success disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {busy ? "Updating..." : nextAction.label}
                                                    </button>
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
