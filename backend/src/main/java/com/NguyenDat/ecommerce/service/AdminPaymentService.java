package com.NguyenDat.ecommerce.service;

import org.springframework.data.domain.Pageable;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.PaymentUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.PaymentResponse;

public interface AdminPaymentService {
    PageResponse<PaymentResponse> getAllPayments(Pageable pageable);

    PaymentResponse getPaymentById(Long id);

    PaymentResponse updatePaymentStatus(Long id, PaymentUpdateRequest request);
}
