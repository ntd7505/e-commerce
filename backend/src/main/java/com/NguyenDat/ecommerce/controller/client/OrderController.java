package com.NguyenDat.ecommerce.controller.client;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class OrderController {

    OrderService orderService;

    @PostMapping("/checkout/preview")
    public ResponseEntity<ApiResponse<CheckoutPreviewResponse>> previewOrder(
            @RequestBody @Valid CheckoutPreviewRequest checkoutPreviewRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.CHECKOUT_PREVIEW_CREATED, orderService.createCheckoutPreview(checkoutPreviewRequest)));
    }
}
