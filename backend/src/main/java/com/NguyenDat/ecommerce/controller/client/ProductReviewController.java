package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.service.ProductReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

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
    public ResponseEntity<ApiResponse<List<ProductReviewResponse>>> getAllReviewsProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ofList(
                ResponseCode.PRODUCT_REVIEWS_FETCHED, productReviewService.getAllReviewsProduct(productId)));
    }

    @GetMapping("/products/{productId}/review-summary")
    public ResponseEntity<ApiResponse<ProductReviewSummaryResponse>> getReviewSummaryByProductId(
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEW_SUMMARY_FETCHED,
                productReviewService.getReviewSummaryByProductId(productId)));
    }
}
