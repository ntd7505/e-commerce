export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type ShippingStatus =
  | "NOT_SHIPPED"
  | "PREPARING"
  | "SHIPPING"
  | "PENDING"
  | "CANCELLED"
  | "DELIVERED"
  | "RETURNED";

export type PaymentResponse = {
  id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionCode: string | null;
  paidAt: string | null;
};

// OrderItem hiện chưa có ảnh đại diện.
// TODO: Backend OrderItemResponse chưa trả imageUrl - tạm dùng placeholder ở UI.
export type OrderItem = {
  id: number;
  productId: number;
  productVariantId: number;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  addressId: number | null;
  couponId: number | null;
  couponCode: string | null;
  items: OrderItem[];
  subtotalAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  note: string | null;
  payment: PaymentResponse | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderListParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type OrderTabKey =
  | "ALL"
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type OrderFilterTab = {
  key: OrderTabKey;
  label: string;
  statuses: OrderStatus[] | null;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  CANCELLED: "Đã hủy thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  MOMO: "MoMo",
  VNPAY: "VNPAY",
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status] ?? status;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] ?? method;
}

// Badge classes theo spec: bg-{c}-50 text-{c}-700 border-{c}-200
export function getOrderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-warning-soft text-warning border-warning-soft";
    case "CONFIRMED":
      return "bg-primary-soft text-primary border-primary-soft";
    case "PROCESSING":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "SHIPPING":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "DELIVERED":
      return "bg-success-soft text-success border-success-soft";
    case "COMPLETED":
      return "bg-success-soft text-success border-success-soft";
    case "CANCELLED":
      return "bg-danger-soft text-danger border-danger-soft";
    case "RETURNED":
      return "bg-surface-alt text-text border-border-strong";
    default:
      return "bg-surface-alt text-text border-border-strong";
  }
}

export function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  switch (status) {
    case "PAID":
      return "bg-success-soft text-success border-success-soft";
    case "UNPAID":
      return "bg-warning-soft text-warning border-warning-soft";
    case "FAILED":
      return "bg-danger-soft text-danger border-danger-soft";
    case "CANCELLED":
      return "bg-surface-alt text-text border-border-strong";
    case "REFUNDED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    default:
      return "bg-surface-alt text-text border-border-strong";
  }
}

export const ORDER_TIMELINE: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPING",
  "DELIVERED",
  "COMPLETED",
];

export const ORDER_FILTER_TABS: OrderFilterTab[] = [
  { key: "ALL", label: "Tất cả", statuses: null },
  { key: "PENDING", label: "Chờ xác nhận", statuses: ["PENDING"] },
  { key: "CONFIRMED", label: "Đã xác nhận", statuses: ["CONFIRMED"] },
  { key: "PROCESSING", label: "Đang xử lý", statuses: ["PROCESSING"] },
  { key: "SHIPPING", label: "Đang giao", statuses: ["SHIPPING"] },
  { key: "DELIVERED", label: "Đã giao", statuses: ["DELIVERED", "COMPLETED"] },
  { key: "CANCELLED", label: "Đã hủy", statuses: ["CANCELLED"] },
  { key: "RETURNED", label: "Trả hàng", statuses: ["RETURNED"] },
];

// ---- Action predicates ----
export function canCancelDirect(order: Order): boolean {
  return order.status === "PENDING";
}

export function canRequestCancel(order: Order): boolean {
  return order.status === "CONFIRMED" || order.status === "PROCESSING" || order.status === "SHIPPING";
}

export function canConfirmReceived(order: Order): boolean {
  return order.status === "DELIVERED";
}

export function canReview(order: Order): boolean {
  return order.status === "DELIVERED" || order.status === "COMPLETED";
}
