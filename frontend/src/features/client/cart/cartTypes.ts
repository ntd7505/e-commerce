export interface CartItemResponse {
  id: number | null;
  productId: number;
  productSlug: string;
  productName: string;
  productVariantId: number;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnailUrl: string;
}

export interface CartResponse {
  id: number | null;
  status: string;
  items: CartItemResponse[];
  totalItems: number;
  subtotalAmount: number;
}

export interface AddCartItemRequest {
  productVariantId: number;
  quantity: number;
}

export interface GuestCartItemRequest {
  productVariantId: number;
  quantity: number;
}

export interface GuestCartRequest {
  items: GuestCartItemRequest[];
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Addresses
export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';

export interface AddressResponse {
  id: number;
  recipientName: string;
  phoneNumber: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  fullAddress: string;
  addressType: AddressType;
  isDefault: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  fullAddress: string;
  addressType: AddressType;
  isDefault: boolean;
}

// Checkout
export interface CheckoutPreviewRequest {
  cartItemIds: number[];
  couponCode?: string;
  addressId?: number;
}

export interface CheckoutPreviewResponse {
  shippingAddress: AddressResponse | null;
  items: CartItemResponse[];
  subtotalAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  totalItems: number;
  paymentMethods: string[];
  selectedCouponCode: string | null;
}

// Orders
export interface CreateOrderRequest {
  cartItemIds: number[];
  addressId: number;
  couponCode?: string;
  paymentMethod: string;
  note?: string;
}

export interface OrderBasicResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// Coupons
export interface CouponResponse {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  startDate: string;
  endDate: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  message?: string;
  coupon?: CouponResponse;
}
