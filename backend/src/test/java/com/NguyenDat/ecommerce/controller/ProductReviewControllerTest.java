package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.controller.client.ProductReviewController;
import com.NguyenDat.ecommerce.dto.request.ProductReviewFilterRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.response.ProductReviewEligibilityResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewSummaryResponse;
import com.NguyenDat.ecommerce.service.ProductReviewService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(ProductReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductReviewControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    ProductReviewService productReviewService;

    @Test
    void createProductReview_shouldReturnCreatedResponse() throws Exception {
        ProductReviewCreateRequest request = ProductReviewCreateRequest.builder()
                .orderItemId(10L)
                .rating(5)
                .anonymous(false)
                .build();
        ProductReviewResponse response =
                ProductReviewResponse.builder().id(1L).rating(5).build();
        when(productReviewService.createProductReview(any(ProductReviewCreateRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/client/reviews")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEW_CREATED.getCode()))
                .andExpect(jsonPath("$.data.rating").value(5));
    }

    @Test
    void createProductReview_shouldRejectInvalidRating() throws Exception {
        ProductReviewCreateRequest request =
                ProductReviewCreateRequest.builder().orderItemId(10L).rating(6).build();

        mockMvc.perform(post("/api/v1/client/reviews")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getReviewsAndSummary_shouldReturnProductReviewData() throws Exception {
        when(productReviewService.getReviews(eq(1L), any(ProductReviewFilterRequest.class)))
                .thenReturn(PageResponse.<ProductReviewResponse>builder()
                        .content(List.of(ProductReviewResponse.builder().id(2L).rating(4).build()))
                        .page(0)
                        .size(10)
                        .totalElements(1)
                        .totalPages(1)
                        .first(true)
                        .last(true)
                        .build());
        when(productReviewService.getReviewSummaryByProductId(1L))
                .thenReturn(ProductReviewSummaryResponse.builder()
                        .averageRating(4.0)
                        .totalReviews(1L)
                        .build());

        mockMvc.perform(get("/api/v1/client/products/{productId}/reviews", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].rating").value(4));
        mockMvc.perform(get("/api/v1/client/products/{productId}/review-summary", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.averageRating").value(4.0));

        verify(productReviewService).getReviews(eq(1L), any(ProductReviewFilterRequest.class));
        verify(productReviewService).getReviewSummaryByProductId(1L);
    }

    @Test
    void getReviewEligibility_shouldReturnEligibilityData() throws Exception {
        when(productReviewService.getReviewEligibility(1L))
                .thenReturn(ProductReviewEligibilityResponse.builder()
                        .eligible(true)
                        .orderItemId(10L)
                        .build());

        mockMvc.perform(get("/api/v1/client/products/{productId}/review-eligibility", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEW_ELIGIBILITY_FETCHED.getCode()))
                .andExpect(jsonPath("$.data.eligible").value(true))
                .andExpect(jsonPath("$.data.orderItemId").value(10));

        verify(productReviewService).getReviewEligibility(1L);
    }

    @Test
    void getMyReviews_shouldReturnPagedCurrentUserReviews() throws Exception {
        when(productReviewService.getMyReviews(any()))
                .thenReturn(PageResponse.<ProductReviewResponse>builder()
                        .content(List.of(ProductReviewResponse.builder().id(5L).rating(5).build()))
                        .page(0)
                        .size(10)
                        .totalElements(1)
                        .totalPages(1)
                        .first(true)
                        .last(true)
                        .build());

        mockMvc.perform(get("/api/v1/client/reviews/me").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEWS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data.content[0].id").value(5))
                .andExpect(jsonPath("$.data.content[0].rating").value(5));

        verify(productReviewService).getMyReviews(any());
    }
}
