package com.nguyendat.ecommerce.service;

import java.util.List;

import com.nguyendat.ecommerce.dto.response.PaymentMethodResponse;

public interface PaymentMethodService {
    List<PaymentMethodResponse> getPaymentMethods();
}

