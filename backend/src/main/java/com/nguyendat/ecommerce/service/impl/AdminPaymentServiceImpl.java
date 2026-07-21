package com.nguyendat.ecommerce.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.PaymentUpdateRequest;
import com.nguyendat.ecommerce.dto.response.PaymentResponse;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.Payment;
import com.nguyendat.ecommerce.enums.PaymentStatus;
import com.nguyendat.ecommerce.mapper.PaymentMapper;
import com.nguyendat.ecommerce.repository.OrderRepository;
import com.nguyendat.ecommerce.repository.PaymentRepository;
import com.nguyendat.ecommerce.service.AdminPaymentService;
import com.nguyendat.ecommerce.service.OrderPaymentService;

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

