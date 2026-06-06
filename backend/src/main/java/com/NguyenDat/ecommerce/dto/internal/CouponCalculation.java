package com.NguyenDat.ecommerce.dto.internal;

import java.math.BigDecimal;

import com.NguyenDat.ecommerce.entity.Coupon;

public record CouponCalculation(Coupon coupon, BigDecimal discountAmount) {

    public static CouponCalculation empty() {
        return new CouponCalculation(null, BigDecimal.ZERO);
    }

    public boolean hasCoupon() {
        return coupon != null;
    }
}
