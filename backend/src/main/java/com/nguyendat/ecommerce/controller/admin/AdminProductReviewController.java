package com.nguyendat.ecommerce.controller.admin;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.PageRequest;
import com.nguyendat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.nguyendat.ecommerce.service.ProductReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.PRODUCT_ACCESS)
public class AdminProductReviewController {

    ProductReviewService productReviewService;

    @GetMapping("/product-reviews")
    public ResponseEntity<ApiResponse<PageResponse<ProductReviewResponse>>> getReviewsPage(
            @Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEWS_FETCHED,
                productReviewService.getReviewsForAdmin(pageRequest.toPageable())));
    }

    @PatchMapping("/product-reviews/{reviewId}/moderation")
    public ResponseEntity<ApiResponse<ProductReviewResponse>> moderateReview(
            @PathVariable Long reviewId, @RequestBody @Valid ProductReviewModerationRequest request) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_REVIEW_MODERATED, productReviewService.moderateReview(reviewId, request)));
    }

    @DeleteMapping("/product-reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        productReviewService.deleteReviewForAdmin(reviewId);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_REVIEW_DELETED, null));
    }
}

