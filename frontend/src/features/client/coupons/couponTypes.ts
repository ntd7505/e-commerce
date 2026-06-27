export type CouponCategory = "NEXAMART" | "PAYMENT" | "SHIPPING";

export type CouponStatus = "ACTIVE" | "EXPIRED" | "USED";

export type CouponDiscountType = "PERCENT" | "FIXED_AMOUNT";

// TODO: Replace local coupon samples with client coupon API when available.
export type ClientCoupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: CouponCategory;
  expiresAt: string;
  status: CouponStatus;
  minOrderAmount?: number;
  discountValue?: number;
  discountType?: CouponDiscountType;
};