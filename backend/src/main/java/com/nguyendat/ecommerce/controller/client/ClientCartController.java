package com.nguyendat.ecommerce.controller.client;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.dto.request.CartItemRequest;
import com.nguyendat.ecommerce.dto.request.CartItemUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CartResponse;
import com.nguyendat.ecommerce.service.CartService;

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

    @PatchMapping("/cart/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItemInCart(
            @PathVariable Long itemId, @RequestBody @Valid CartItemUpdateRequest cartItemUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.CART_ITEM_UPDATED, cartService.updateCartItemInCart(itemId, cartItemUpdateRequest)));
    }

    @DeleteMapping("/cart/items")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_CLEARED, null));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable Long itemId) {
        cartService.deleteCartItem(itemId);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_ITEM_REMOVED, null));
    }

    @PostMapping("/cart/guest/preview")
    public ResponseEntity<ApiResponse<CartResponse>> previewGuestCart(
            @RequestBody @Valid com.nguyendat.ecommerce.dto.request.GuestCartRequest request) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_FETCHED, cartService.previewGuestCart(request)));
    }

    @PostMapping("/cart/merge")
    public ResponseEntity<ApiResponse<CartResponse>> mergeGuestCart(
            @RequestBody @Valid com.nguyendat.ecommerce.dto.request.GuestCartRequest request) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CART_FETCHED, cartService.mergeGuestCart(request)));
    }
}

