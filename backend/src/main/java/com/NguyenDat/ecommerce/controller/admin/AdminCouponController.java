package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.CouponRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;
import com.NguyenDat.ecommerce.service.CouponService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminCouponController {

    CouponService couponService;

    @PostMapping("/coupons")
    public ApiResponse<CouponResponse> createCoupon(@RequestBody @Valid CouponRequest couponRequest) {
        return ApiResponse.of(ResponseCode.COUPON_CREATED, couponService.createCoupon(couponRequest));
    }

    @GetMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> getCouponById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.COUPON_FETCHED, couponService.getCouponById(id));
    }

    @GetMapping("/coupons")
    public ApiResponse<List<CouponResponse>> getAllCoupon() {
        return ApiResponse.ofList(ResponseCode.COUPONS_FETCHED, couponService.getAllCoupons());
    }

    @PutMapping("/coupons/{id}")
    public ApiResponse<CouponResponse> updateCouponById(
            @RequestBody @Valid CouponRequest couponRequest, @PathVariable Long id) {
        return ApiResponse.of(ResponseCode.COUPON_UPDATED, couponService.updateCouponById(couponRequest, id));
    }

    @DeleteMapping("/coupons/{id}")
    public ApiResponse<Void> deleteCouponById(@PathVariable Long id) {
        couponService.deletedCouponById(id);
        return ApiResponse.of(ResponseCode.COUPON_DELETED, null);
    }
}
