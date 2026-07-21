package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.dto.request.CartItemRequest;
import com.nguyendat.ecommerce.dto.request.CartItemUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CartResponse;

public interface CartService {

    CartResponse addItemToCart(CartItemRequest cartItemRequest);

    CartResponse getCart();

    CartResponse updateCartItemInCart(Long itemId, CartItemUpdateRequest cartItemUpdateRequest);

    void clearCart();

    void deleteCartItem(Long itemId);

    CartResponse previewGuestCart(com.nguyendat.ecommerce.dto.request.GuestCartRequest request);

    CartResponse mergeGuestCart(com.nguyendat.ecommerce.dto.request.GuestCartRequest request);
}

