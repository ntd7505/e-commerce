package com.NguyenDat.ecommerce.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.service.OrderPaymentService;

@Service
public class OrderPaymentServiceImpl implements OrderPaymentService {

    @Override
    public Payment createCodPayment(Order order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(PaymentMethod.COD);
        payment.setStatus(PaymentStatus.UNPAID);
        payment.setAmount(order.getTotalAmount());
        return payment;
    }

    @Override
    public void markPaid(Order order) {
        Payment payment = requirePayment(order);
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
    }

    @Override
    public void markCancelled(Order order) {
        requirePayment(order).setStatus(PaymentStatus.CANCELLED);
    }

    private Payment requirePayment(Order order) {
        if (order.getPayment() == null) {
            throw new AppException(ErrorCode.PAYMENT_NOT_FOUND);
        }
        return order.getPayment();
    }
}
