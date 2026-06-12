export type DiscountType = "PERCENT" | "FIXED_AMOUNT";

export type CouponResponse = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscountAmount: number | null;
    usageLimit: number | null;
    usedCount: number;
    perUserLimit: number | null;
    startAt: string | null;
    endAt: string | null;
    active: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CouponRequest = {
    code: string;
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    perUserLimit?: number;
    startAt?: string;
    endAt?: string;
};