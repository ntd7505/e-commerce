package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
import com.NguyenDat.ecommerce.controller.admin.AdminProductReviewController;
import com.NguyenDat.ecommerce.dto.request.ProductReviewModerationRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.service.ProductReviewService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AdminProductReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminProductReviewControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    ProductReviewService productReviewService;

    @Test
    void getReviewsPage_shouldReturnPagedReviews() throws Exception {
        when(productReviewService.getReviewsForAdmin(any()))
                .thenReturn(PageResponse.<ProductReviewResponse>builder()
                        .content(List.of(ProductReviewResponse.builder().id(1L).rating(5).build()))
                        .page(0)
                        .size(10)
                        .totalElements(1)
                        .totalPages(1)
                        .first(true)
                        .last(true)
                        .build());

        mockMvc.perform(get("/api/v1/admin/product-reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEWS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data.content[0].id").value(1));

        verify(productReviewService).getReviewsForAdmin(any());
    }

    @Test
    void moderateReview_shouldUpdateActiveStatus() throws Exception {
        ProductReviewModerationRequest request = ProductReviewModerationRequest.builder()
                .active(false)
                .note("Hide spam review")
                .build();
        when(productReviewService.moderateReview(eq(1L), any(ProductReviewModerationRequest.class)))
                .thenReturn(ProductReviewResponse.builder().id(1L).active(false).build());

        mockMvc.perform(patch("/api/v1/admin/product-reviews/{reviewId}/moderation", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEW_MODERATED.getCode()))
                .andExpect(jsonPath("$.data.active").value(false));

        verify(productReviewService).moderateReview(eq(1L), any(ProductReviewModerationRequest.class));
    }

    @Test
    void deleteReview_shouldSoftDeleteReview() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/product-reviews/{reviewId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_REVIEW_DELETED.getCode()));

        verify(productReviewService).deleteReviewForAdmin(1L);
    }
}
