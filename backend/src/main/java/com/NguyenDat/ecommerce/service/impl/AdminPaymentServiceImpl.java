package com.NguyenDat.ecommerce.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.PaymentUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.PaymentResponse;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.mapper.PaymentMapper;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.repository.PaymentRepository;
import com.NguyenDat.ecommerce.service.AdminPaymentService;
import com.NguyenDat.ecommerce.service.OrderPaymentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class AdminPaymentServiceImpl implements AdminPaymentService {

    PaymentRepository paymentRepository;
    OrderRepository orderRepository;
    OrderPaymentService orderPaymentService;
    PaymentMapper paymentMapper;

    @Override
    public PageResponse<PaymentResponse> getAllPayments(Pageable pageable) {
        Page<Payment> page = paymentRepository.findAll(pageable);
        return PageResponse.from(page.map(this::toEnrichedResponse));
    }

    @Override
    public PaymentResponse getPaymentById(Long id) {
        Payment payment =
                paymentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return toEnrichedResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, PaymentUpdateRequest request) {
        Payment payment =
                paymentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (request.getStatus() == PaymentStatus.PAID && payment.getPaidAt() == null) {
            orderPaymentService.markPaid(payment.getOrder());
        } else if (request.getStatus() == PaymentStatus.CANCELLED) {
            orderPaymentService.markCancelled(payment.getOrder());
        } else {
            payment.setStatus(request.getStatus());
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Sync Order payment status
        if (savedPayment.getOrder() != null) {
            Order order = savedPayment.getOrder();
            order.setPaymentStatus(savedPayment.getStatus());
            orderRepository.save(order);
        }

        return toEnrichedResponse(savedPayment);
    }

    private PaymentResponse toEnrichedResponse(Payment payment) {
        PaymentResponse response = paymentMapper.toPaymentResponse(payment);
        orderPaymentService.enrichPaymentResponse(response);
        return response;
    }
}
