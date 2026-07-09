package com.NguyenDat.ecommerce.controller.admin;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.dto.request.PaymentUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.PaymentResponse;
import com.NguyenDat.ecommerce.service.AdminPaymentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    AdminPaymentService adminPaymentService;

    @GetMapping
    public ApiResponse<PageResponse<PaymentResponse>> getAllPayments(Pageable pageable) {
        return ApiResponse.of(ResponseCode.PAYMENTS_FETCHED, adminPaymentService.getAllPayments(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PAYMENT_FETCHED, adminPaymentService.getPaymentById(id));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<PaymentResponse> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody PaymentUpdateRequest request) {
        return ApiResponse.of(ResponseCode.PAYMENT_STATUS_UPDATED, adminPaymentService.updatePaymentStatus(id, request));
    }
}
