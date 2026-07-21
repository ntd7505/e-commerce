package com.nguyendat.ecommerce.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.controller.admin.AdminDashboardController;
import com.nguyendat.ecommerce.dto.response.AdminDashboardResponse;
import com.nguyendat.ecommerce.service.AdminDashboardService;

@WebMvcTest(AdminDashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminDashboardControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AdminDashboardService adminDashboardService;

    @Test
    void getDashboard_shouldReturnDashboardData() throws Exception {
        when(adminDashboardService.getDashboard())
                .thenReturn(AdminDashboardResponse.builder()
                        .totalOrders(10L)
                        .totalRevenue(BigDecimal.valueOf(1_000_000))
                        .totalProducts(5L)
                        .build());

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.DASHBOARD_FETCHED.getCode()))
                .andExpect(jsonPath("$.data.totalOrders").value(10))
                .andExpect(jsonPath("$.data.totalRevenue").value(1_000_000));

        verify(adminDashboardService).getDashboard();
    }
}

