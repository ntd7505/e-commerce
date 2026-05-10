package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.controller.client.ClientCartController;
import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.response.CartItemResponse;
import com.NguyenDat.ecommerce.dto.response.CartResponse;
import com.NguyenDat.ecommerce.enums.CartStatus;
import com.NguyenDat.ecommerce.service.CartService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(ClientCartController.class)
@AutoConfigureMockMvc(addFilters = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
class CartControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    CartService cartService;

    CartItemRequest cartItemRequest;
    CartResponse cartResponse;

    @BeforeEach
    void setUp() {
        cartItemRequest =
                CartItemRequest.builder().productVariantId(1L).quantity(2).build();

        CartItemResponse cartItemResponse = CartItemResponse.builder()
                .id(1L)
                .productId(10L)
                .productName("Ao thun")
                .productVariantId(1L)
                .variantName("Size M")
                .sku("AO-M-001")
                .quantity(2)
                .unitPrice(BigDecimal.valueOf(120000))
                .lineTotal(BigDecimal.valueOf(240000))
                .build();

        cartResponse = CartResponse.builder()
                .id(1L)
                .status(CartStatus.ACTIVE)
                .items(List.of(cartItemResponse))
                .totalItems(2)
                .subtotalAmount(BigDecimal.valueOf(240000))
                .build();
    }

    @Test
    void getCart_shouldReturnCartResponse() throws Exception {
        when(cartService.getCart()).thenReturn(cartResponse);

        mockMvc.perform(get("/api/v1/client/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CART_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CART_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.totalItems").value(2))
                .andExpect(jsonPath("$.data.subtotalAmount").value(240000))
                .andExpect(jsonPath("$.data.items[0].productVariantId").value(1));

        verify(cartService).getCart();
    }

    @Test
    void addCartItem_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(cartService.addItemToCart(any(CartItemRequest.class))).thenReturn(cartResponse);

        mockMvc.perform(post("/api/v1/client/cart/items")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cartItemRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.CART_ITEM_ADDED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CART_ITEM_ADDED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.items.length()").value(1));

        verify(cartService).addItemToCart(any(CartItemRequest.class));
    }

    @Test
    void addCartItem_shouldReturnErrorResponse_whenQuantityExceedsStock() throws Exception {
        when(cartService.addItemToCart(any(CartItemRequest.class)))
                .thenThrow(new AppException(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK));

        mockMvc.perform(post("/api/v1/client/cart/items")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cartItemRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK.getMessage()));

        verify(cartService).addItemToCart(any(CartItemRequest.class));
    }

    @Test
    void deleteCartItem_shouldReturnRemovedResponse_whenItemExists() throws Exception {
        doNothing().when(cartService).deleteCartItemInCart(1L);

        mockMvc.perform(delete("/api/v1/client/cart/items/{itemId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CART_ITEM_REMOVED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CART_ITEM_REMOVED.getMessage()));

        verify(cartService).deleteCartItemInCart(1L);
    }

    @Test
    void deleteCartItem_shouldReturnErrorResponse_whenItemNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.CART_ITEM_NOT_FOUND))
                .when(cartService)
                .deleteCartItemInCart(1L);

        mockMvc.perform(delete("/api/v1/client/cart/items/{itemId}", 1L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(ErrorCode.CART_ITEM_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CART_ITEM_NOT_FOUND.getMessage()));

        verify(cartService).deleteCartItemInCart(1L);
    }
}
