package com.NguyenDat.ecommerce.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.dto.response.PaymentMethodResponse;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.service.PaymentMethodService;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
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
                        .description("Tính năng sẽ được hỗ trợ sau.")
                        .enabled(false)
                        .build(),
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.MOMO)
                        .name("Ví MoMo")
                        .description("Tính năng sẽ được hỗ trợ sau.")
                        .enabled(false)
                        .build(),
                PaymentMethodResponse.builder()
                        .method(PaymentMethod.VNPAY)
                        .name("VNPay")
                        .description("Tính năng sẽ được hỗ trợ sau.")
                        .enabled(false)
                        .build());
    }
}
