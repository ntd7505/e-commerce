export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED"
    | "COMPLETED";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type ShippingStatus =
    | "NOT_SHIPPED"
    | "PREPARING"
    | "SHIPPING"
    | "PENDING"
    | "CANCELLED"
    | "DELIVERED"
    | "RETURNED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";

export type PaymentResponse = {
    id: number;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    transactionCode: string | null;
    paidAt: string | null;
};

export type OrderItemResponse = {
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

export type OrderResponse = {
    id: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingStatus: ShippingStatus;
    recipientName: string;
    phoneNumber: string;
    shippingAddress: string;
    addressId: number;
    couponId: number | null;
    couponCode: string | null;
    items: OrderItemResponse[];
    subtotalAmount: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    note: string | null;
    userAvatarUrl: string | null;
    payment: PaymentResponse | null;
    createdAt: string;
    updatedAt: string;
};
