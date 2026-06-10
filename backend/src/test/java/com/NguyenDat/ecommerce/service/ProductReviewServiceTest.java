package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.entity.Product;
import com.NguyenDat.ecommerce.entity.ProductReview;
import com.NguyenDat.ecommerce.entity.ProductReviewMedia;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.ReviewMediaType;
import com.NguyenDat.ecommerce.mapper.ProductReviewMapper;
import com.NguyenDat.ecommerce.repository.OrderItemRepository;
import com.NguyenDat.ecommerce.repository.ProductReviewRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.impl.ProductReviewServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProductReviewServiceTest {

    @Mock
    ProductReviewRepository productReviewRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    OrderItemRepository orderItemRepository;

    @Mock
    ProductReviewMapper productReviewMapper;

    @Mock
    Authentication authentication;

    @InjectMocks
    ProductReviewServiceImpl productReviewService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createProductReview_shouldSaveReviewWithUserProductAndMedia() {
        ProductReviewMediaRequest mediaRequest = ProductReviewMediaRequest.builder()
                .url("review.jpg")
                .mediaType(ReviewMediaType.IMAGE)
                .sortOrder(0)
                .build();
        ProductReviewCreateRequest request = ProductReviewCreateRequest.builder()
                .orderItemId(10L)
                .rating(5)
                .anonymous(false)
                .media(List.of(mediaRequest))
                .build();
        User user = User.builder().id(1L).build();
        Product product = new Product();
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        OrderItem orderItem = new OrderItem();
        orderItem.setProductVariant(variant);
        ProductReview review = new ProductReview();
        ProductReviewMedia media = new ProductReviewMedia();
        ProductReviewResponse response = new ProductReviewResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("dat@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmailAndDeletedFalse("dat@example.com")).thenReturn(Optional.of(user));
        when(orderItemRepository.findById(10L)).thenReturn(Optional.of(orderItem));
        when(productReviewMapper.toProductReview(request)).thenReturn(review);
        when(productReviewMapper.toProductReviewMedia(mediaRequest)).thenReturn(media);
        when(productReviewRepository.save(review)).thenReturn(review);
        when(productReviewMapper.toProductReviewResponse(review)).thenReturn(response);

        assertEquals(response, productReviewService.createProductReview(request));
        assertEquals(user, review.getUser());
        assertEquals(product, review.getProduct());
        assertEquals(orderItem, review.getOrderItem());
        assertEquals(List.of(media), review.getMedia());
        assertEquals(review, media.getReview());
    }

    @Test
    void createProductReview_shouldRejectUnauthenticatedUser() {
        ProductReviewCreateRequest request =
                ProductReviewCreateRequest.builder().orderItemId(10L).rating(5).build();

        AppException exception =
                assertThrows(AppException.class, () -> productReviewService.createProductReview(request));

        assertEquals(ErrorCode.UNAUTHENTICATED, exception.getErrorCode());
        verifyNoInteractions(productReviewRepository);
    }

    @Test
    void getReviewSummary_shouldCalculateAverageCountsAndPercentages() {
        ProductReview fiveStar = reviewWithRating(5);
        ProductReview threeStar = reviewWithRating(3);
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L))
                .thenReturn(List.of(fiveStar, threeStar));

        ProductReviewSummaryResponse result = productReviewService.getReviewSummaryByProductId(1L);

        assertEquals(4.0, result.getAverageRating());
        assertEquals(2, result.getTotalReviews());
        assertEquals(1, result.getFiveStarCount());
        assertEquals(1, result.getThreeStarCount());
        assertEquals(50.0, result.getFiveStarPercent());
        assertEquals(50.0, result.getThreeStarPercent());
    }

    @Test
    void getReviewSummary_shouldRejectProductWithoutReviews() {
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L))
                .thenReturn(List.of());

        AppException exception =
                assertThrows(AppException.class, () -> productReviewService.getReviewSummaryByProductId(1L));

        assertEquals(ErrorCode.REVIEW_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getAllReviewsProduct_shouldMapActiveReviews() {
        ProductReview review = reviewWithRating(5);
        ProductReviewResponse response = new ProductReviewResponse();
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L))
                .thenReturn(List.of(review));
        when(productReviewMapper.toProductReviewResponse(review)).thenReturn(response);

        List<ProductReviewResponse> result = productReviewService.getAllReviewsProduct(1L);

        assertEquals(List.of(response), result);
    }

    private ProductReview reviewWithRating(int rating) {
        ProductReview review = new ProductReview();
        review.setRating(rating);
        return review;
    }
}
