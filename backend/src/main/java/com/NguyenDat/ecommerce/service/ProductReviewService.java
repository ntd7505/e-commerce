package com.NguyenDat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;

public interface ProductReviewService {

    ProductReviewResponse createProductReview(@Valid ProductReviewCreateRequest productReviewCreateRequest);

    List<ProductReviewResponse> getAllReviewsProduct(Long productId);

    ProductReviewSummaryResponse getReviewSummaryByProductId(Long productId);
}
