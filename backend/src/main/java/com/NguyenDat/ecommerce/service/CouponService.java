package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.CouponRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;

public interface CouponService {
    CouponResponse createCoupon(CouponRequest couponRequest);

    CouponResponse getCouponById(Long id);

    List<CouponResponse> getAllCoupons();

    CouponResponse updateCouponById(CouponRequest couponRequest, Long id);

    void deletedCouponById(Long id);
}
