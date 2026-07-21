package com.nguyendat.ecommerce.service;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.PaymentUpdateRequest;
import com.nguyendat.ecommerce.dto.response.PaymentResponse;

public interface AdminPaymentService {
    PageResponse<PaymentResponse> getAllPayments(Pageable pageable);

    PaymentResponse getPaymentById(Long id);

    PaymentResponse updatePaymentStatus(Long id, PaymentUpdateRequest request);
}

