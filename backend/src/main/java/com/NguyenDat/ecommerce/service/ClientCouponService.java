package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.CouponValidationRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;
import com.NguyenDat.ecommerce.dto.response.CouponValidationResponse;

public interface ClientCouponService {
    List<CouponResponse> getAvailableCoupons();

    List<CouponResponse> getMyCoupons();

    CouponValidationResponse validateCoupon(CouponValidationRequest request);
}
