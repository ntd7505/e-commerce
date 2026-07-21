package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.Payment;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.enums.PaymentStatus;
import com.nguyendat.ecommerce.service.impl.OrderPaymentServiceImpl;

class OrderPaymentServiceTest {

    OrderPaymentServiceImpl orderPaymentService = new OrderPaymentServiceImpl();

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        org.springframework.test.util.ReflectionTestUtils.setField(orderPaymentService, "clock", java.time.Clock.systemDefaultZone());
    }

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
        Order order = new Order();
        AppException exception = assertThrows(AppException.class, () -> orderPaymentService.markPaid(order));

        assertEquals(ErrorCode.PAYMENT_NOT_FOUND, exception.getErrorCode());
    }

    private Order orderWithPayment() {
        Order order = new Order();
        order.setPayment(new Payment());
        return order;
    }
}

