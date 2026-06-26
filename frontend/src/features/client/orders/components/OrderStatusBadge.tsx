import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "../orderTypes";
import type { OrderStatus, PaymentStatus } from "../orderTypes";

type BadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusBadge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getOrderStatusBadgeClass(
        status,
      )} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {getOrderStatusLabel(status)}
    </span>
  );
}

type PaymentBadgeProps = {
  status: PaymentStatus;
  className?: string;
};

export function PaymentStatusBadge({ status, className = "" }: PaymentBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getPaymentStatusBadgeClass(
        status,
      )} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {getPaymentStatusLabel(status)}
    </span>
  );
}
