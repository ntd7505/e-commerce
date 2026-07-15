import { Badge } from "../../../../components/common";
import type { OrderStatus, PaymentStatus, ShippingStatus } from "../adminOrderTypes";

type StatusBadgeProps = {
    value: OrderStatus | PaymentStatus | ShippingStatus;
};

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" | "primary" }> = {
    // Order status
    PENDING: { label: "Chờ xử lý", variant: "warning" },
    CONFIRMED: { label: "Đã xác nhận", variant: "primary" },
    PROCESSING: { label: "Đang xử lý", variant: "warning" },
    SHIPPING: { label: "Đang giao", variant: "primary" },
    DELIVERED: { label: "Đã giao", variant: "success" },
    COMPLETED: { label: "Hoàn thành", variant: "success" },
    CANCELLED: { label: "Đã hủy", variant: "danger" },
    
    // Payment status
    UNPAID: { label: "Chưa trả tiền", variant: "warning" },
    PAID: { label: "Đã thanh toán", variant: "success" },
    REFUNDED: { label: "Đã hoàn tiền", variant: "neutral" },
    FAILED: { label: "Thất bại", variant: "danger" },

    // Shipping status
    NOT_SHIPPED: { label: "Chưa giao", variant: "neutral" },
    RETURNED: { label: "Đã trả hàng", variant: "neutral" },
};

export function OrderStatusBadge({ value }: StatusBadgeProps) {
    const config = STATUS_MAP[value.toUpperCase()] || { label: value, variant: "neutral" };
    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
}
