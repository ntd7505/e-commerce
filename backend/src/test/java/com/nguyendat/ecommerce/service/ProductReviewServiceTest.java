package com.nguyendat.ecommerce.service;

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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderItem;
import com.nguyendat.ecommerce.entity.Product;
import com.nguyendat.ecommerce.entity.ProductReview;
import com.nguyendat.ecommerce.entity.ProductReviewMedia;
import com.nguyendat.ecommerce.entity.ProductVariant;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.enums.ReviewMediaType;
import com.nguyendat.ecommerce.mapper.ProductReviewMapper;
import com.nguyendat.ecommerce.repository.OrderItemRepository;
import com.nguyendat.ecommerce.repository.ProductReviewMediaRepository;
import com.nguyendat.ecommerce.repository.ProductReviewRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.impl.ProductReviewServiceImpl;

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
    ProductReviewMediaRepository productReviewMediaRepository;

    @Mock
    CurrentUserService currentUserService;

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
        orderItem.setId(10L);
        orderItem.setProductVariant(variant);
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.COMPLETED);
        orderItem.setOrder(order);
        ProductReview review = new ProductReview();
        ProductReviewMedia media = new ProductReviewMedia();
        ProductReviewResponse response = new ProductReviewResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("dat@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmailAndDeletedFalse("dat@example.com")).thenReturn(Optional.of(user));
        when(orderItemRepository.findById(10L)).thenReturn(Optional.of(orderItem));
        when(productReviewRepository.existsByOrderItemId(10L)).thenReturn(false);
        when(productReviewMapper.toProductReview(request)).thenReturn(review);
        when(productReviewMapper.toProductReviewMedia(mediaRequest)).thenReturn(media);
        when(productReviewRepository.saveAndFlush(review)).thenReturn(review);
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
        when(productReviewMediaRepository.countByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(1L))
                .thenReturn(2L);

        ProductReviewSummaryResponse result = productReviewService.getReviewSummaryByProductId(1L);

        assertEquals(4.0, result.getAverageRating());
        assertEquals(2, result.getTotalReviews());
        assertEquals(1, result.getFiveStarCount());
        assertEquals(1, result.getThreeStarCount());
        assertEquals(2, result.getTotalMedia());
        assertEquals(50.0, result.getFiveStarPercent());
        assertEquals(50.0, result.getThreeStarPercent());
    }

    @Test
    void getReviewSummary_shouldReturnEmptySummaryForProductWithoutReviews() {
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L))
                .thenReturn(List.of());

        ProductReviewSummaryResponse result = productReviewService.getReviewSummaryByProductId(1L);

        assertEquals(0D, result.getAverageRating());
        assertEquals(0L, result.getTotalReviews());
        assertEquals(0L, result.getTotalMedia());
        assertEquals(0D, result.getFiveStarPercent());
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

    @Test
    void getReviewsForAdmin_shouldReturnNonDeletedReviewsPage() {
        ProductReview review = reviewWithRating(5);
        ProductReviewResponse response = ProductReviewResponse.builder().id(1L).build();
        PageRequest pageable = PageRequest.of(0, 10);
        when(productReviewRepository.findAllByDeletedFalse(pageable))
                .thenReturn(new PageImpl<>(List.of(review), pageable, 1));
        when(productReviewMapper.toProductReviewResponse(review)).thenReturn(response);

        PageResponse<ProductReviewResponse> result = productReviewService.getReviewsForAdmin(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(List.of(response), result.getContent());
    }

    @Test
    void moderateReview_shouldUpdateActiveStatus() {
        ProductReview review = reviewWithRating(5);
        review.setDeleted(false);
        ProductReviewResponse response =
                ProductReviewResponse.builder().id(1L).active(false).build();
        ProductReviewModerationRequest request =
                ProductReviewModerationRequest.builder().active(false).build();
        when(productReviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(productReviewRepository.save(review)).thenReturn(review);
        when(productReviewMapper.toProductReviewResponse(review)).thenReturn(response);

        ProductReviewResponse result = productReviewService.moderateReview(1L, request);

        assertFalse(review.isActive());
        assertEquals(response, result);
    }

    @Test
    void deleteReviewForAdmin_shouldSoftDeleteAndDeactivateReview() {
        ProductReview review = reviewWithRating(5);
        review.setActive(true);
        review.setDeleted(false);
        when(productReviewRepository.findById(1L)).thenReturn(Optional.of(review));

        productReviewService.deleteReviewForAdmin(1L);

        assertTrue(review.isDeleted());
        assertFalse(review.isActive());
        verify(productReviewRepository).save(review);
    }

    private ProductReview reviewWithRating(int rating) {
        ProductReview review = new ProductReview();
        review.setRating(rating);
        return review;
    }
}

