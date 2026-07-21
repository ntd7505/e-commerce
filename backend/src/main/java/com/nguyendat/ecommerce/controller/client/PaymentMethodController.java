package com.nguyendat.ecommerce.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.dto.response.PaymentMethodResponse;
import com.nguyendat.ecommerce.service.PaymentMethodService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class PaymentMethodController {

    PaymentMethodService paymentMethodService;

    @GetMapping("/payment-methods")
    public ResponseEntity<ApiResponse<List<PaymentMethodResponse>>> getPaymentMethods() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.PAYMENT_METHODS_FETCHED, paymentMethodService.getPaymentMethods()));
    }
}

