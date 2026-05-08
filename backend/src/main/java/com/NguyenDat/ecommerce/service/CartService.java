package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.response.CartResponse;

public interface CartService {

    CartResponse addItemToCart(CartItemRequest cartItemRequest);

    CartResponse getCart();

    void deleteCartItemInCart(Long itemId);
}

