import type { OrderStatus, PaymentStatus, ShippingStatus } from "../adminOrderTypes";

type StatusBadgeProps = {
    value: OrderStatus | PaymentStatus | ShippingStatus;
};

const statusClass: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-indigo-50 text-indigo-700",
    SHIPPING: "bg-sky-50 text-sky-700",
    DELIVERED: "bg-emerald-50 text-emerald-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    PAID: "bg-emerald-50 text-emerald-700",
    UNPAID: "bg-amber-50 text-amber-700",
    FAILED: "bg-red-50 text-red-600",
    CANCELLED: "bg-red-50 text-red-600",
    REFUNDED: "bg-gray-100 text-gray-600",
    RETURNED: "bg-gray-100 text-gray-600",
    NOT_SHIPPED: "bg-gray-100 text-gray-600",
    PREPARING: "bg-blue-50 text-blue-700",
};

export function OrderStatusBadge({ value }: StatusBadgeProps) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[value] ?? "bg-gray-100 text-gray-600"}`}>
            {value.replaceAll("_", " ")}
        </span>
    );
}
