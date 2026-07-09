package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.PaymentUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.PaymentResponse;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.mapper.PaymentMapper;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.repository.PaymentRepository;
import com.NguyenDat.ecommerce.service.impl.AdminPaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminPaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderPaymentService orderPaymentService;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private AdminPaymentServiceImpl adminPaymentService;

    private Payment payment;
    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setPaymentStatus(PaymentStatus.UNPAID);

        payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.UNPAID);
        payment.setOrder(order);
    }

    @Test
    void updatePaymentStatus_ToPaid_ShouldDelegateToMarkPaid() {
        PaymentUpdateRequest request = new PaymentUpdateRequest();
        request.setStatus(PaymentStatus.PAID);

        doAnswer(invocation -> {
            payment.setStatus(PaymentStatus.PAID);
            return null;
        }).when(orderPaymentService).markPaid(order);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(paymentMapper.toPaymentResponse(payment)).thenReturn(new PaymentResponse());

        adminPaymentService.updatePaymentStatus(1L, request);

        verify(orderPaymentService).markPaid(order);
        verify(orderRepository).save(order);
        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
    }

    @Test
    void updatePaymentStatus_ToCancelled_ShouldDelegateToMarkCancelled() {
        PaymentUpdateRequest request = new PaymentUpdateRequest();
        request.setStatus(PaymentStatus.CANCELLED);

        doAnswer(invocation -> {
            payment.setStatus(PaymentStatus.CANCELLED);
            return null;
        }).when(orderPaymentService).markCancelled(order);

        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(paymentMapper.toPaymentResponse(payment)).thenReturn(new PaymentResponse());

        adminPaymentService.updatePaymentStatus(1L, request);

        verify(orderPaymentService).markCancelled(order);
        verify(orderRepository).save(order);
        assertEquals(PaymentStatus.CANCELLED, order.getPaymentStatus());
    }
}
