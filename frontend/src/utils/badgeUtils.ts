import type { BadgeVariant } from "../components/admin/AdminBadge";

export function badgeVariantForStatus(status: string): BadgeVariant {
    switch (status.toUpperCase()) {
        case "ACTIVE":
        case "APPROVED":
        case "DELIVERED":
        case "COMPLETED":
        case "PAID":
            return "success";
        case "PENDING":
        case "UNPAID":
        case "PREPARING":
        case "PROCESSING":
            return "warning";
        case "FAILED":
        case "CANCELLED":
        case "REJECTED":
        case "BANNED":
        case "INACTIVE_BANNED":
            return "danger";
        case "INACTIVE":
        case "REFUNDED":
        case "RETURNED":
        case "NOT_SHIPPED":
            return "neutral";
        case "CONFIRMED":
        case "SHIPPING":
            return "info";
        default:
            return "neutral";
    }
}
