package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.CouponRequest;
import com.NguyenDat.ecommerce.dto.request.CouponStatusUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;

public interface CouponService {
    CouponResponse createCoupon(CouponRequest couponRequest);

    CouponResponse getCouponById(Long id);

    List<CouponResponse> getAllCoupons();

    List<CouponResponse> getAllCouponDeleted();

    CouponResponse updateCouponById(CouponRequest couponRequest, Long id);

    CouponResponse updateStatusCouponById(CouponStatusUpdateRequest couponStatusUpdateRequest, Long id);

    CouponResponse restoreCouponById(Long id);

    void deletedCouponById(Long id);
}
