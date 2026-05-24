package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.request.CartItemUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.CartResponse;

public interface CartService {

    CartResponse addItemToCart(CartItemRequest cartItemRequest);

    CartResponse getCart();

    CartResponse updateCartItemInCart(Long itemId, CartItemUpdateRequest cartItemUpdateRequest);

    void clearCart();

    void deleteCartItem(Long itemId);
}
