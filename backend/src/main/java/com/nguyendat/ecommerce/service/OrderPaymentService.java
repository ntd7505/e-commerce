package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.Payment;

public interface OrderPaymentService {

    Payment createCodPayment(Order order);

    Payment createBankTransferPayment(Order order);

    void enrichPaymentResponse(com.nguyendat.ecommerce.dto.response.PaymentResponse response);

    void markPaid(Order order);

    void markCancelled(Order order);
}

