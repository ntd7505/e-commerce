package com.NguyenDat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.entity.ProductReview;
import com.NguyenDat.ecommerce.entity.ProductReviewMedia;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.mapper.ProductReviewMapper;
import com.NguyenDat.ecommerce.repository.OrderItemRepository;
import com.NguyenDat.ecommerce.repository.ProductReviewRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.ProductReviewService;

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

        return productReviewMapper.toProductReviewResponse(productReviewRepository.save(productReview));
    }

    @Override
    public List<ProductReviewResponse> getAllReviewsProduct(Long productId) {
        return productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(productId).stream()
                .map(productReviewMapper::toProductReviewResponse)
                .toList();
    }

    @Override
    public ProductReviewSummaryResponse getReviewSummaryByProductId(Long productId) {
        List<ProductReview> productReviews =
                productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(productId);
        if (productReviews.isEmpty()) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }

        long totalReviews = productReviews.size();

        double totalRating = 0;
        long fiveStarCount = 0;
        long fourStarCount = 0;
        long threeStarCount = 0;
        long twoStarCount = 0;
        long oneStarCount = 0;
        for (ProductReview productReview : productReviews) {
            totalRating += productReview.getRating();
            int rating = productReview.getRating();
            if (rating == 5) {
                fiveStarCount++;
            } else if (rating == 4) {
                fourStarCount++;
            } else if (rating == 3) {
                threeStarCount++;
            } else if (rating == 2) {
                twoStarCount++;
            } else if (rating == 1) {
                oneStarCount++;
            }
        }

        return ProductReviewSummaryResponse.builder()
                .averageRating(totalRating / totalReviews)
                .totalReviews(totalReviews)
                .fiveStarCount(fiveStarCount)
                .fourStarCount(fourStarCount)
                .threeStarCount(threeStarCount)
                .twoStarCount(twoStarCount)
                .oneStarCount(oneStarCount)
                .fiveStarPercent((double) fiveStarCount / totalReviews * 100)
                .fourStarPercent((double) fourStarCount / totalReviews * 100)
                .threeStarPercent((double) threeStarCount / totalReviews * 100)
                .twoStarPercent((double) twoStarCount / totalReviews * 100)
                .oneStarPercent((double) oneStarCount / totalReviews * 100)
                .build();
    }
}
