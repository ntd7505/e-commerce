package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.service.impl.OrderPaymentServiceImpl;

class OrderPaymentServiceTest {

    OrderPaymentServiceImpl orderPaymentService = new OrderPaymentServiceImpl();

    @Test
    void createCodPayment_shouldCreateUnpaidPaymentForOrderTotal() {
        Order order = new Order();
        order.setTotalAmount(BigDecimal.valueOf(230_000));

        Payment payment = orderPaymentService.createCodPayment(order);

        assertEquals(order, payment.getOrder());
        assertEquals(PaymentMethod.COD, payment.getMethod());
        assertEquals(PaymentStatus.UNPAID, payment.getStatus());
        assertEquals(order.getTotalAmount(), payment.getAmount());
    }

    @Test
    void markPaid_shouldUpdateStatusAndPaidTime() {
        Order order = orderWithPayment();

        orderPaymentService.markPaid(order);

        assertEquals(PaymentStatus.PAID, order.getPayment().getStatus());
        assertNotNull(order.getPayment().getPaidAt());
    }

    @Test
    void markCancelled_shouldUpdatePaymentStatus() {
        Order order = orderWithPayment();

        orderPaymentService.markCancelled(order);

        assertEquals(PaymentStatus.CANCELLED, order.getPayment().getStatus());
    }

    @Test
    void markPaid_shouldRejectOrderWithoutPayment() {
        AppException exception = assertThrows(AppException.class, () -> orderPaymentService.markPaid(new Order()));

        assertEquals(ErrorCode.PAYMENT_NOT_FOUND, exception.getErrorCode());
    }

    private Order orderWithPayment() {
        Order order = new Order();
        order.setPayment(new Payment());
        return order;
    }
}
