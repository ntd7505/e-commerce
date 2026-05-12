package com.NguyenDat.ecommerce.service;

import jakarta.validation.Valid;

import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;

public interface ProductReviewService {

    ProductReviewResponse createProductReview(@Valid ProductReviewCreateRequest productReviewCreateRequest);
}
