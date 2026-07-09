package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;

public interface OrderPaymentService {

    Payment createCodPayment(Order order);

    Payment createBankTransferPayment(Order order);

    void enrichPaymentResponse(com.NguyenDat.ecommerce.dto.response.PaymentResponse response);

    void markPaid(Order order);

    void markCancelled(Order order);
}
