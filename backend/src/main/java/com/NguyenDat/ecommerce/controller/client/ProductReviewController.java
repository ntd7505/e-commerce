package com.NguyenDat.ecommerce.controller.client;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.ProductReviewFilterRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.service.ProductReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ProductReviewController {

    ProductReviewService productReviewService;

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ProductReviewResponse>> createProductReview(
            @RequestBody @Valid ProductReviewCreateRequest productReviewCreateRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        ResponseCode.PRODUCT_REVIEW_CREATED,
                        productReviewService.createProductReview(productReviewCreateRequest)));
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<ApiResponse<PageResponse<ProductReviewResponse>>> getProductReviews(
            @PathVariable Long productId,
            @ModelAttribute @Valid ProductReviewFilterRequest filter) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEWS_FETCHED,
                productReviewService.getReviews(productId, filter)));
    }

    @GetMapping("/products/{productId}/review-media")
    public ResponseEntity<ApiResponse<PageResponse<ProductReviewMediaResponse>>> getReviewMedia(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "12") @Min(1) @Max(50) int size
    ) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEW_MEDIA_FETCHED,
                productReviewService.getReviewMedia(productId, pageable)
        ));
    }

    @GetMapping("/products/{productId}/review-summary")
    public ResponseEntity<ApiResponse<ProductReviewSummaryResponse>> getReviewSummaryByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEW_SUMMARY_FETCHED,
                productReviewService.getReviewSummaryByProductId(productId)));
    }
}
