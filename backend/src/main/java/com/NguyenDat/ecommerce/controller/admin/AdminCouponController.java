package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.CouponRequest;
import com.NguyenDat.ecommerce.dto.request.CouponStatusUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
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
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@RequestBody @Valid CouponRequest couponRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.COUPON_CREATED, couponService.createCoupon(couponRequest)));
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.COUPON_FETCHED, couponService.getCouponById(id)));
    }

    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<PageResponse<CouponResponse>>> getCouponsPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.COUPONS_FETCHED, couponService.getCouponsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/coupons/all")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupon() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.COUPONS_FETCHED, couponService.getAllCoupons()));
    }

    @GetMapping("/coupons/deleted")
    public ResponseEntity<ApiResponse<PageResponse<CouponResponse>>> getDeletedCouponsPage(
            @Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.DELETED_COUPONS_FETCHED, couponService.getDeletedCouponsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/coupons/deleted/all")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCouponDeleted() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.DELETED_COUPONS_FETCHED, couponService.getAllCouponDeleted()));
    }

    @PatchMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCouponById(
            @RequestBody @Valid CouponRequest couponRequest, @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.COUPON_UPDATED, couponService.updateCouponById(couponRequest, id)));
    }

    @PatchMapping("/coupons/{id}/status")
    public ResponseEntity<ApiResponse<CouponResponse>> updateStatusCouponById(
            @RequestBody @Valid CouponStatusUpdateRequest couponStatusUpdateRequest, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.COUPON_STATUS_UPDATED,
                couponService.updateStatusCouponById(couponStatusUpdateRequest, id)));
    }

    @PatchMapping("/coupons/{id}/restore")
    public ResponseEntity<ApiResponse<CouponResponse>> restoreCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.COUPON_RESTORED, couponService.restoreCouponById(id)));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCouponById(@PathVariable Long id) {
        couponService.deletedCouponById(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.COUPON_DELETED, null));
    }
}
