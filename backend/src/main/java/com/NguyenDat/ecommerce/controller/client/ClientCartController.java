package com.NguyenDat.ecommerce.controller.client;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.response.CartResponse;
import com.NguyenDat.ecommerce.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientCartController {

    CartService cartService;

    @GetMapping("/cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_FETCHED, cartService.getCart()));
    }

    @PostMapping("/cart/items")
    public ResponseEntity<ApiResponse<CartResponse>> addCartItemToCart(
            @RequestBody @Valid CartItemRequest cartItemRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.CART_ITEM_ADDED, cartService.addItemToCart(cartItemRequest)));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> deleteCartItemInCart(@PathVariable Long itemId) {
        cartService.deleteCartItemInCart(itemId);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_ITEM_REMOVED, null));
    }
}
