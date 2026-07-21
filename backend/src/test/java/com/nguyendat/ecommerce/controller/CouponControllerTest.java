package com.nguyendat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.controller.admin.AdminCouponController;
import com.nguyendat.ecommerce.dto.request.CouponRequest;
import com.nguyendat.ecommerce.dto.request.CouponStatusUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.enums.DiscountType;
import com.nguyendat.ecommerce.service.CouponService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AdminCouponController.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class CouponControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    CouponService couponService;

    CouponRequest couponRequest;
    CouponStatusUpdateRequest couponStatusUpdateRequest;
    CouponResponse couponResponse;

    @BeforeEach
    void setUp() {
        couponRequest = CouponRequest.builder()
                .code("SALE10")
                .name("Sale 10 percent")
                .description("Discount 10 percent")
                .discountType(DiscountType.PERCENT)
                .discountValue(BigDecimal.valueOf(10))
                .minOrderAmount(BigDecimal.valueOf(500000))
                .maxDiscountAmount(BigDecimal.valueOf(100000))
                .usageLimit(100)
                .perUserLimit(1)
                .startAt(LocalDateTime.of(2026, java.time.Month.MAY, 5, 0, 0))
                .endAt(LocalDateTime.of(2026, java.time.Month.MAY, 31, 23, 59))
                .build();

        couponStatusUpdateRequest =
                CouponStatusUpdateRequest.builder().active(false).build();

        couponResponse = CouponResponse.builder()
                .id(1L)
                .code("SALE10")
                .name("Sale 10 percent")
                .description("Discount 10 percent")
                .discountType(DiscountType.PERCENT)
                .discountValue(BigDecimal.valueOf(10))
                .minOrderAmount(BigDecimal.valueOf(500000))
                .maxDiscountAmount(BigDecimal.valueOf(100000))
                .usageLimit(100)
                .usedCount(0)
                .perUserLimit(1)
                .active(true)
                .deleted(false)
                .build();
    }

    @Test
    void createCoupon_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(couponService.createCoupon(any(CouponRequest.class))).thenReturn(couponResponse);

        mockMvc.perform(post("/api/v1/admin/coupons")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(couponRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.code").value("SALE10"))
                .andExpect(jsonPath("$.data.name").value("Sale 10 percent"))
                .andExpect(jsonPath("$.data.active").value(true));

        verify(couponService).createCoupon(any(CouponRequest.class));
    }

    @Test
    void createCoupon_shouldReturnErrorResponse_whenCouponAlreadyExists() throws Exception {
        when(couponService.createCoupon(any(CouponRequest.class)))
                .thenThrow(new AppException(ErrorCode.COUPON_EXISTED));

        mockMvc.perform(post("/api/v1/admin/coupons")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(couponRequest)))
                .andExpect(status().is(ErrorCode.COUPON_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.COUPON_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.COUPON_EXISTED.getMessage()));

        verify(couponService).createCoupon(any(CouponRequest.class));
    }

    @Test
    void getCouponById_shouldReturnFetchedResponse_whenCouponExists() throws Exception {
        when(couponService.getCouponById(1L)).thenReturn(couponResponse);

        mockMvc.perform(get("/api/v1/admin/coupons/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.code").value("SALE10"));

        verify(couponService).getCouponById(1L);
    }

    @Test
    void getAllCoupons_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        when(couponService.getAllCoupons()).thenReturn(List.of(couponResponse));

        mockMvc.perform(get("/api/v1/admin/coupons/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPONS_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPONS_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].code").value("SALE10"));

        verify(couponService).getAllCoupons();
    }

    @Test
    void getAllDeletedCoupons_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        when(couponService.getAllCouponDeleted()).thenReturn(List.of(couponResponse));

        mockMvc.perform(get("/api/v1/admin/coupons/deleted/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.DELETED_COUPONS_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.DELETED_COUPONS_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].code").value("SALE10"));

        verify(couponService).getAllCouponDeleted();
    }

    @Test
    void updateCouponById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        when(couponService.updateCouponById(any(CouponRequest.class), eq(1L))).thenReturn(couponResponse);

        mockMvc.perform(patch("/api/v1/admin/coupons/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(couponRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.code").value("SALE10"));

        verify(couponService).updateCouponById(any(CouponRequest.class), eq(1L));
    }

    @Test
    void updateCouponStatusById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        CouponResponse inactiveResponse = CouponResponse.builder()
                .id(1L)
                .code("SALE10")
                .name("Sale 10 percent")
                .active(false)
                .deleted(false)
                .build();

        when(couponService.updateStatusCouponById(any(CouponStatusUpdateRequest.class), eq(1L)))
                .thenReturn(inactiveResponse);

        mockMvc.perform(patch("/api/v1/admin/coupons/{id}/status", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(couponStatusUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_STATUS_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_STATUS_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.active").value(false));

        verify(couponService).updateStatusCouponById(any(CouponStatusUpdateRequest.class), eq(1L));
    }

    @Test
    void restoreCouponById_shouldReturnRestoredResponse_whenCouponExists() throws Exception {
        CouponResponse restoredResponse = CouponResponse.builder()
                .id(1L)
                .code("SALE10")
                .name("Sale 10 percent")
                .active(false)
                .deleted(false)
                .build();

        when(couponService.restoreCouponById(1L)).thenReturn(restoredResponse);

        mockMvc.perform(patch("/api/v1/admin/coupons/{id}/restore", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_RESTORED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_RESTORED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.deleted").value(false));

        verify(couponService).restoreCouponById(1L);
    }

    @Test
    void deleteCouponById_shouldReturnDeletedResponse_whenCouponExists() throws Exception {
        doNothing().when(couponService).deletedCouponById(1L);

        mockMvc.perform(delete("/api/v1/admin/coupons/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.COUPON_DELETED.getMessage()));

        verify(couponService).deletedCouponById(1L);
    }

    @Test
    void deleteCouponById_shouldReturnErrorResponse_whenCouponNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.COUPON_NOT_FOUND))
                .when(couponService)
                .deletedCouponById(1L);

        mockMvc.perform(delete("/api/v1/admin/coupons/{id}", 1L))
                .andExpect(
                        status().is(ErrorCode.COUPON_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.COUPON_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.COUPON_NOT_FOUND.getMessage()));

        verify(couponService).deletedCouponById(1L);
    }
}

