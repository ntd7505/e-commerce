package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;

public interface OrderPaymentService {

    Payment createCodPayment(Order order);

    void markPaid(Order order);

    void markCancelled(Order order);
}
