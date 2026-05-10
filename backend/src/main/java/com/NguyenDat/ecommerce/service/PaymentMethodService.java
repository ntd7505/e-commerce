package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.response.PaymentMethodResponse;

public interface PaymentMethodService {
    List<PaymentMethodResponse> getPaymentMethods();
}
