package com.nguyendat.ecommerce.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nguyendat.ecommerce.dto.response.PaymentMethodResponse;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.service.PaymentMethodService;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private static final String UPCOMING_FEATURE_DESC = "Tính năng sẽ được hỗ trợ sau.";

    @Override
    public List<PaymentMethodResponse> getPaymentMethods() {
        return List.of(
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.COD)
                        .name("Thanh toán khi nhận hàng")
                        .description("Thanh toán bằng tiền mặt khi đơn hàng được giao.")
                        .enabled(true)
                        .build(),
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.BANK_TRANSFER)
                        .name("Chuyển khoản ngân hàng")
                        .description(UPCOMING_FEATURE_DESC)
                        .enabled(false)
                        .build(),
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.MOMO)
                        .name("Ví MoMo")
                        .description(UPCOMING_FEATURE_DESC)
                        .enabled(false)
                        .build(),
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.VNPAY)
                        .name("VNPay")
                        .description(UPCOMING_FEATURE_DESC)
                        .enabled(false)
                        .build());
    }
}

