package com.NguyenDat.ecommerce.service;

import jakarta.validation.Valid;

import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;

public interface OrderService {

    CheckoutPreviewResponse createCheckoutPreview(@Valid CheckoutPreviewRequest checkoutPreviewRequest);
}
