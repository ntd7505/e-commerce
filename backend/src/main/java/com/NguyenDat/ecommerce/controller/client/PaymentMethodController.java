package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.PaymentMethodResponse;
import com.NguyenDat.ecommerce.service.PaymentMethodService;

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
