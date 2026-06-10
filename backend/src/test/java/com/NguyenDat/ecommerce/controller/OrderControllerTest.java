package com.NguyenDat.ecommerce.controller;

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

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.controller.client.OrderController;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.service.OrderService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    OrderService orderService;

    @Test
    void previewOrder_shouldReturnCalculatedAmounts() throws Exception {
        CheckoutPreviewRequest request =
                CheckoutPreviewRequest.builder().cartItemIds(List.of(1L)).build();
        CheckoutPreviewResponse response = CheckoutPreviewResponse.builder()
                .totalAmount(BigDecimal.valueOf(230_000))
                .totalItems(2)
                .build();
        when(orderService.createCheckoutPreview(any(CheckoutPreviewRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/client/checkout/preview")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CHECKOUT_PREVIEW_CREATED.getCode()))
                .andExpect(jsonPath("$.data.totalItems").value(2));
    }

    @Test
    void createOrder_shouldReturnCreatedResponse() throws Exception {
        CheckoutRequest request = CheckoutRequest.builder()
                .cartItemIds(List.of(1L))
                .paymentMethod(PaymentMethod.COD)
                .build();
        OrderResponse response =
                OrderResponse.builder().id(10L).status(OrderStatus.PENDING).build();
        when(orderService.createOrder(any(CheckoutRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/client/orders")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.ORDER_CREATED.getCode()))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    void getMyOrderByIdAndPage_shouldReturnOrderData() throws Exception {
        OrderResponse response = OrderResponse.builder().id(10L).build();
        PageResponse<OrderResponse> page = PageResponse.<OrderResponse>builder()
                .content(List.of(response))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();
        when(orderService.getMyOrderById(10L)).thenReturn(response);
        when(orderService.getMyOrdersInPage(any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/client/orders/{orderId}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(10));
        mockMvc.perform(get("/api/v1/client/orders").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].id").value(10));
    }

    @Test
    void requestOrderCancellation_shouldDelegateRequest() throws Exception {
        OrderCancelRequestRequest request =
                OrderCancelRequestRequest.builder().reason("Wrong address").build();
        when(orderService.requestOrderCancellation(any(OrderCancelRequestRequest.class), any(Long.class)))
                .thenReturn(OrderCancelRequestResponse.builder().id(20L).build());

        mockMvc.perform(post("/api/v1/client/orders/{orderId}/cancellation-requests", 10L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ORDER_CANCEL_REQUEST_CREATED.getCode()))
                .andExpect(jsonPath("$.data.id").value(20));

        verify(orderService).requestOrderCancellation(any(OrderCancelRequestRequest.class), any(Long.class));
    }
}
