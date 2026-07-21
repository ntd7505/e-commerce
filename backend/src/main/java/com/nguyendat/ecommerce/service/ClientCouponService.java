package com.nguyendat.ecommerce.service;

import java.util.List;

import com.nguyendat.ecommerce.dto.request.CouponValidationRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.dto.response.CouponValidationResponse;

public interface ClientCouponService {
    List<CouponResponse> getAvailableCoupons();

    List<CouponResponse> getMyCoupons();

    CouponValidationResponse validateCoupon(CouponValidationRequest request);
}

