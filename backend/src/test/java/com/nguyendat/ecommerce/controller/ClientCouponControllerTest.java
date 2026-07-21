package com.nguyendat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.controller.client.ClientCouponController;
import com.nguyendat.ecommerce.dto.request.CouponValidationRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.dto.response.CouponValidationResponse;
import com.nguyendat.ecommerce.enums.DiscountType;
import com.nguyendat.ecommerce.service.ClientCouponService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(ClientCouponController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClientCouponControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    ClientCouponService clientCouponService;

    @Test
    void getAvailableCoupons_shouldReturnCoupons() throws Exception {
        when(clientCouponService.getAvailableCoupons()).thenReturn(List.of(couponResponse()));

        mockMvc.perform(get("/api/v1/client/coupons/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.AVAILABLE_COUPONS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data[0].code").value("SALE10"));

        verify(clientCouponService).getAvailableCoupons();
    }

    @Test
    void getMyCoupons_shouldReturnUsedCoupons() throws Exception {
        when(clientCouponService.getMyCoupons()).thenReturn(List.of(couponResponse()));

        mockMvc.perform(get("/api/v1/client/coupons/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.MY_COUPONS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data[0].code").value("SALE10"));

        verify(clientCouponService).getMyCoupons();
    }

    @Test
    void validateCoupon_shouldReturnDiscountAmount() throws Exception {
        CouponValidationRequest request = CouponValidationRequest.builder()
                .code("SALE10")
                .subtotalAmount(BigDecimal.valueOf(500_000))
                .build();
        when(clientCouponService.validateCoupon(any(CouponValidationRequest.class)))
                .thenReturn(CouponValidationResponse.builder()
                        .coupon(couponResponse())
                        .discountAmount(BigDecimal.valueOf(50_000))
                        .build());

        mockMvc.perform(post("/api/v1/client/coupons/validate")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.COUPON_VALIDATED.getCode()))
                .andExpect(jsonPath("$.data.coupon.code").value("SALE10"))
                .andExpect(jsonPath("$.data.discountAmount").value(50000));

        verify(clientCouponService).validateCoupon(any(CouponValidationRequest.class));
    }

    private CouponResponse couponResponse() {
        return CouponResponse.builder()
                .id(1L)
                .code("SALE10")
                .name("Sale 10 percent")
                .discountType(DiscountType.PERCENT)
                .discountValue(BigDecimal.TEN)
                .active(true)
                .deleted(false)
                .build();
    }
}

