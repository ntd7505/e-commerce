package com.nguyendat.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.CouponRequest;
import com.nguyendat.ecommerce.dto.request.CouponStatusUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;

public interface CouponService {
    CouponResponse createCoupon(CouponRequest couponRequest);

    CouponResponse getCouponById(Long id);

    List<CouponResponse> getAllCoupons();

    PageResponse<CouponResponse> getCouponsInPage(Pageable pageable);

    List<CouponResponse> getAllCouponDeleted();

    PageResponse<CouponResponse> getDeletedCouponsInPage(Pageable pageable);

    CouponResponse updateCouponById(CouponRequest couponRequest, Long id);

    CouponResponse updateStatusCouponById(CouponStatusUpdateRequest couponStatusUpdateRequest, Long id);

    CouponResponse restoreCouponById(Long id);

    void deletedCouponById(Long id);
}

