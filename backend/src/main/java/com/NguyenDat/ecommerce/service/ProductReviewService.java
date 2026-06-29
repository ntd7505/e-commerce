package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.NguyenDat.ecommerce.dto.request.ProductReviewFilterRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.ProductReviewEligibilityResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductReviewService {

    ProductReviewResponse createProductReview(@Valid ProductReviewCreateRequest productReviewCreateRequest);

    List<ProductReviewResponse> getAllReviewsProduct(Long productId);

    ProductReviewSummaryResponse getReviewSummaryByProductId(Long productId);

    PageResponse<ProductReviewResponse> getReviews(
            Long productId,
            ProductReviewFilterRequest filter
    );

    PageResponse<ProductReviewMediaResponse> getReviewMedia(
            Long productId,
            Pageable pageable
    );

    ProductReviewEligibilityResponse getReviewEligibility(Long productId);

    PageResponse<ProductReviewResponse> getMyReviews(Pageable pageable);

    PageResponse<ProductReviewResponse> getReviewsForAdmin(Pageable pageable);

    ProductReviewResponse moderateReview(Long reviewId, ProductReviewModerationRequest request);

    void deleteReviewForAdmin(Long reviewId);
}
