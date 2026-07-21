package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.CouponValidationRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;
import com.NguyenDat.ecommerce.dto.response.CouponValidationResponse;
import com.NguyenDat.ecommerce.service.ClientCouponService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientCouponController {

    ClientCouponService clientCouponService;

    @GetMapping("/coupons/available")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAvailableCoupons() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.AVAILABLE_COUPONS_FETCHED, clientCouponService.getAvailableCoupons()));
    }

    @GetMapping("/coupons/my")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getMyCoupons() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.MY_COUPONS_FETCHED, clientCouponService.getMyCoupons()));
    }

    @PostMapping("/coupons/validate")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validateCoupon(
            @RequestBody @Valid CouponValidationRequest request) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.COUPON_VALIDATED, clientCouponService.validateCoupon(request)));
    }
}
