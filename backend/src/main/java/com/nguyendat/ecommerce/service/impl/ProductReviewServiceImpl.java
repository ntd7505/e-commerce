package com.nguyendat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.ProductReviewFilterRequest;
import com.nguyendat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.nguyendat.ecommerce.dto.response.ProductReviewEligibilityResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.nguyendat.ecommerce.entity.*;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.mapper.ProductReviewMapper;
import com.nguyendat.ecommerce.repository.OrderItemRepository;
import com.nguyendat.ecommerce.repository.ProductReviewMediaRepository;
import com.nguyendat.ecommerce.repository.ProductReviewRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.repository.specification.ProductReviewSpecification;
import com.nguyendat.ecommerce.service.CurrentUserService;
import com.nguyendat.ecommerce.service.ProductReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ProductReviewServiceImpl implements ProductReviewService {

    ProductReviewRepository productReviewRepository;
    UserRepository userRepository;
    OrderItemRepository orderItemRepository;
    ProductReviewMapper productReviewMapper;
    ProductReviewMediaRepository productReviewMediaRepository;
    CurrentUserService currentUserService;

    @Override
    @Transactional
    public ProductReviewResponse createProductReview(ProductReviewCreateRequest productReviewCreateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String email = authentication.getName();
        User user = userRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        OrderItem orderItem = orderItemRepository
                .findById(productReviewCreateRequest.getOrderItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_ITEM_NOT_FOUND));

        Order order = orderItem.getOrder();

        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.REVIEW_NOT_BELONG_TO_USER);
        }

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new AppException(ErrorCode.REVIEW_ORDER_NOT_COMPLETED);
        }

        if (productReviewRepository.existsByOrderItemId(orderItem.getId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        ProductReview productReview = productReviewMapper.toProductReview(productReviewCreateRequest);

        productReview.setUser(user);
        productReview.setProduct(orderItem.getProductVariant().getProduct());
        productReview.setOrderItem(orderItem);
        productReview.setAnonymous(productReviewCreateRequest.getAnonymous());

        List<ProductReviewMedia> productReviewMediaList = new ArrayList<>();
        if (productReviewCreateRequest.getMedia() != null) {
            for (ProductReviewMediaRequest media : productReviewCreateRequest.getMedia()) {
                ProductReviewMedia productReviewMedia = productReviewMapper.toProductReviewMedia(media);
                productReviewMedia.setReview(productReview);
                productReviewMediaList.add(productReviewMedia);
            }
        }
        productReview.setMedia(productReviewMediaList);

        try {
            return productReviewMapper.toProductReviewResponse(productReviewRepository.saveAndFlush(productReview));
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
    }

    @Override
    public List<ProductReviewResponse> getAllReviewsProduct(Long productId) {
        return productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(productId).stream()
                .map(productReviewMapper::toProductReviewResponse)
                .toList();
    }

    @Override
    public ProductReviewSummaryResponse getReviewSummaryByProductId(Long productId) {
        List<ProductReview> reviews = productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(productId);

        if (reviews.isEmpty()) {
            return emptySummary();
        }

        long totalReviews = reviews.size();
        long fiveStarCount = countRating(reviews, 5);
        long fourStarCount = countRating(reviews, 4);
        long threeStarCount = countRating(reviews, 3);
        long twoStarCount = countRating(reviews, 2);
        long oneStarCount = countRating(reviews, 1);

        double averageRating =
                reviews.stream().mapToInt(ProductReview::getRating).average().orElse(0D);

        long totalMedia =
                productReviewMediaRepository.countByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(productId);

        return ProductReviewSummaryResponse.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .totalMedia(totalMedia)
                .fiveStarCount(fiveStarCount)
                .fourStarCount(fourStarCount)
                .threeStarCount(threeStarCount)
                .twoStarCount(twoStarCount)
                .oneStarCount(oneStarCount)
                .fiveStarPercent(calculatePercent(fiveStarCount, totalReviews))
                .fourStarPercent(calculatePercent(fourStarCount, totalReviews))
                .threeStarPercent(calculatePercent(threeStarCount, totalReviews))
                .twoStarPercent(calculatePercent(twoStarCount, totalReviews))
                .oneStarPercent(calculatePercent(oneStarCount, totalReviews))
                .build();
    }

    @Override
    public PageResponse<ProductReviewResponse> getReviews(Long productId, ProductReviewFilterRequest filter) {
        Specification<ProductReview> specification =
                ProductReviewSpecification.filter(productId, filter.getRating(), filter.getHasMedia());

        Page<ProductReviewResponse> page = productReviewRepository
                .findAll(specification, filter.toPageable())
                .map(productReviewMapper::toProductReviewResponse);

        return PageResponse.from(page);
    }

    @Override
    public PageResponse<ProductReviewMediaResponse> getReviewMedia(Long productId, Pageable pageable) {
        Page<ProductReviewMediaResponse> page = productReviewMediaRepository
                .findAllByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(productId, pageable)
                .map(productReviewMapper::toProductReviewMediaResponse);

        return PageResponse.from(page);
    }

    @Override
    public ProductReviewEligibilityResponse getReviewEligibility(Long productId) {
        User user = currentUserService.getCurrentUser();

        List<OrderItem> items =
                orderItemRepository.findAllByOrderUserIdAndProductVariantProductIdOrderByOrderCreatedAtDesc(
                        user.getId(), productId);

        if (items.isEmpty()) {
            return eligibility(false, null, "NOT_PURCHASED");
        }

        for (OrderItem item : items) {
            if (item.getOrder().getStatus() == OrderStatus.COMPLETED
                    && !productReviewRepository.existsByOrderItemId(item.getId())) {
                return eligibility(true, item.getId(), null);
            }
        }

        boolean hasCompletedOrder =
                items.stream().anyMatch(item -> item.getOrder().getStatus() == OrderStatus.COMPLETED);

        return hasCompletedOrder
                ? eligibility(false, null, "ALREADY_REVIEWED")
                : eligibility(false, null, "ORDER_NOT_COMPLETED");
    }

    @Override
    public PageResponse<ProductReviewResponse> getMyReviews(Pageable pageable) {
        User user = currentUserService.getCurrentUser();
        Page<ProductReviewResponse> page = productReviewRepository
                .findAllByUserIdAndDeletedFalse(user.getId(), pageable)
                .map(productReviewMapper::toProductReviewResponse);

        return PageResponse.from(page);
    }

    @Override
    public PageResponse<ProductReviewResponse> getReviewsForAdmin(Pageable pageable) {
        Page<ProductReviewResponse> page = productReviewRepository
                .findAllByDeletedFalse(pageable)
                .map(productReviewMapper::toProductReviewResponse);

        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public ProductReviewResponse moderateReview(Long reviewId, ProductReviewModerationRequest request) {
        ProductReview review = productReviewRepository
                .findById(reviewId)
                .filter(item -> !item.isDeleted())
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        review.setActive(request.getActive());
        return productReviewMapper.toProductReviewResponse(productReviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReviewForAdmin(Long reviewId) {
        ProductReview review = productReviewRepository
                .findById(reviewId)
                .filter(item -> !item.isDeleted())
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        review.setDeleted(true);
        review.setActive(false);
        productReviewRepository.save(review);
    }

    private ProductReviewEligibilityResponse eligibility(boolean eligible, Long orderItemId, String reason) {
        return ProductReviewEligibilityResponse.builder()
                .eligible(eligible)
                .orderItemId(orderItemId)
                .reason(reason)
                .build();
    }

    private long countRating(List<ProductReview> reviews, int rating) {
        return reviews.stream().filter(review -> review.getRating() == rating).count();
    }

    private double calculatePercent(long count, long total) {
        return total == 0 ? 0D : (double) count / total * 100;
    }

    private ProductReviewSummaryResponse emptySummary() {
        return ProductReviewSummaryResponse.builder()
                .averageRating(0D)
                .totalReviews(0L)
                .totalMedia(0L)
                .fiveStarCount(0L)
                .fourStarCount(0L)
                .threeStarCount(0L)
                .twoStarCount(0L)
                .oneStarCount(0L)
                .fiveStarPercent(0D)
                .fourStarPercent(0D)
                .threeStarPercent(0D)
                .twoStarPercent(0D)
                .oneStarPercent(0D)
                .build();
    }
}

