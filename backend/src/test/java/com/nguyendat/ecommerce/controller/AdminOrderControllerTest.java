package com.nguyendat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
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

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.controller.admin.AdminOrderController;
import com.nguyendat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.nguyendat.ecommerce.dto.response.OrderResponse;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.service.OrderService;

@WebMvcTest(AdminOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminOrderControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    OrderService orderService;

    @Test
    void getOrdersPage_shouldReturnPagedOrders() throws Exception {
        OrderResponse order = OrderResponse.builder().id(10L).build();
        PageResponse<OrderResponse> page = PageResponse.<OrderResponse>builder()
                .content(List.of(order))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();
        when(orderService.getOrdersInPage(any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/admin/orders").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ORDERS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data.content[0].id").value(10));
    }

    @Test
    void confirmAndShipOrder_shouldReturnUpdatedOrder() throws Exception {
        when(orderService.confirmOrder(10L))
                .thenReturn(OrderResponse.builder()
                        .id(10L)
                        .status(OrderStatus.CONFIRMED)
                        .build());
        when(orderService.shipOrder(10L))
                .thenReturn(OrderResponse.builder()
                        .id(10L)
                        .status(OrderStatus.SHIPPING)
                        .build());

        mockMvc.perform(post("/api/v1/admin/orders/{orderId}/confirmations", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
        mockMvc.perform(post("/api/v1/admin/orders/{orderId}/shipments", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SHIPPING"));
    }

    @Test
    void approveCancelRequest_shouldReturnApprovedResponse() throws Exception {
        when(orderService.approveCancelOrder(20L))
                .thenReturn(OrderCancelRequestResponse.builder().id(20L).build());

        mockMvc.perform(post("/api/v1/admin/order-cancel-requests/{requestId}/approvals", 20L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ORDER_CANCEL_REQUEST_APPROVED.getCode()))
                .andExpect(jsonPath("$.data.id").value(20));

        verify(orderService).approveCancelOrder(20L);
    }
}

