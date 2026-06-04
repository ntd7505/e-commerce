import { AdminBadge } from "../../../components/AdminBadge";
import { badgeVariantForStatus } from "../../../utils/badgeUtils";
import type { OrderStatus, PaymentStatus, ShippingStatus } from "../adminOrderTypes";

type StatusBadgeProps = {
    value: OrderStatus | PaymentStatus | ShippingStatus;
};

export function OrderStatusBadge({ value }: StatusBadgeProps) {
    return (
        <AdminBadge variant={badgeVariantForStatus(value)}>
            {value.replaceAll("_", " ")}
        </AdminBadge>
    );
}
