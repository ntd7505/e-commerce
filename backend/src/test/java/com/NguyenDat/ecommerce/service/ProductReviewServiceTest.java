package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.entity.ProductReview;
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

    @InjectMocks
    ProductReviewServiceImpl productReviewService;

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
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L)).thenReturn(List.of());

        AppException exception =
                assertThrows(AppException.class, () -> productReviewService.getReviewSummaryByProductId(1L));

        assertEquals(ErrorCode.REVIEW_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getAllReviewsProduct_shouldMapActiveReviews() {
        ProductReview review = reviewWithRating(5);
        ProductReviewResponse response = new ProductReviewResponse();
        when(productReviewRepository.findAllByProductIdAndDeletedFalseAndActiveTrue(1L)).thenReturn(List.of(review));
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
