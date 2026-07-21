package com.nguyendat.ecommerce.controller;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.config.SecurityConfig;
import com.nguyendat.ecommerce.controller.admin.AdminOrderController;
import com.nguyendat.ecommerce.service.OrderService;

@WebMvcTest(AdminOrderController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
class AdminAuthorizationTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    OrderService orderService;

    @Test
    void adminEndpoint_shouldRejectUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/v1/admin/orders/all")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpoint_shouldRejectStaffWithoutRequiredPermission() throws Exception {
        mockMvc.perform(get("/api/v1/admin/orders/all")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_STAFF"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminEndpoint_shouldAllowStaffWithRequiredPermission() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/admin/orders/all")
                        .with(jwt().authorities(
                                        new SimpleGrantedAuthority("ROLE_STAFF"),
                                        new SimpleGrantedAuthority("ORDER_MANAGE"))))
                .andExpect(status().isOk());
    }

    @Test
    void adminEndpoint_shouldAllowAdminRole() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/admin/orders/all")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk());
    }
}

