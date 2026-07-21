package com.nguyendat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.ProductReviewFilterRequest;
import com.nguyendat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.nguyendat.ecommerce.dto.response.ProductReviewEligibilityResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;

public interface ProductReviewService {

    ProductReviewResponse createProductReview(@Valid ProductReviewCreateRequest productReviewCreateRequest);

    List<ProductReviewResponse> getAllReviewsProduct(Long productId);

    ProductReviewSummaryResponse getReviewSummaryByProductId(Long productId);

    PageResponse<ProductReviewResponse> getReviews(Long productId, ProductReviewFilterRequest filter);

    PageResponse<ProductReviewMediaResponse> getReviewMedia(Long productId, Pageable pageable);

    ProductReviewEligibilityResponse getReviewEligibility(Long productId);

    PageResponse<ProductReviewResponse> getMyReviews(Pageable pageable);

    PageResponse<ProductReviewResponse> getReviewsForAdmin(Pageable pageable);

    ProductReviewResponse moderateReview(Long reviewId, ProductReviewModerationRequest request);

    void deleteReviewForAdmin(Long reviewId);
}

