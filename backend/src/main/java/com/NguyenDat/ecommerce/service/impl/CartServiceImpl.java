package com.NguyenDat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.request.CartItemUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.CartResponse;
import com.NguyenDat.ecommerce.entity.Cart;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.CartStatus;
import com.NguyenDat.ecommerce.mapper.CartMapper;
import com.NguyenDat.ecommerce.repository.CartItemRepository;
import com.NguyenDat.ecommerce.repository.CartRepository;
import com.NguyenDat.ecommerce.repository.ProductVariantRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.CartService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    CartMapper cartMapper;
    UserRepository userRepository;
    ProductVariantRepository productVariantRepository;

    @Transactional
    public CartResponse addItemToCart(CartItemRequest cartItemRequest) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        ProductVariant productVariant = productVariantRepository
                .findSellableVariantById(cartItemRequest.getProductVariantId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        if (productVariant.getStockQuantity() == 0) {
            throw new AppException(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK);
        }
        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductVariantId(cart.getId(), productVariant.getId())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    cart.getItems().add(item);
                    item.setProductVariant(productVariant);
                    item.setQuantity(0);
                    item.setUnitPrice(BigDecimal.valueOf(getCurrentPrice(productVariant)));
                    return item;
                });
        int newQuantity = cartItem.getQuantity() + cartItemRequest.getQuantity();
        if (newQuantity > productVariant.getStockQuantity()) {
            throw new AppException(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK);
        }
        cartItem.setQuantity(newQuantity);
        cartItem.setUnitPrice(BigDecimal.valueOf(getCurrentPrice(productVariant)));

        cartItemRepository.save(cartItem);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItemInCart(Long itemId, CartItemUpdateRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository
                .findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        ProductVariant productVariant = productVariantRepository
                .findSellableVariantById(cartItem.getProductVariant().getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        int newQuantity = request.getQuantity();

        if (newQuantity > productVariant.getStockQuantity()) {
            throw new AppException(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK);
        }

        cartItem.setQuantity(newQuantity);
        cartItem.setUnitPrice(BigDecimal.valueOf(getCurrentPrice(productVariant)));

        cartItemRepository.save(cartItem);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteByCartId(cart.getId());
        cart.getItems().clear();
    }

    @Override
    @Transactional
    public void deleteCartItem(Long itemId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository
                .findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        cartItemRepository.delete(cartItem);
    }

    private double getCurrentPrice(ProductVariant productVariant) {
        if (productVariant.getSalePrice() > 0) {
            return productVariant.getSalePrice();
        } else {
            return productVariant.getPrice();
        }
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setStatus(CartStatus.ACTIVE);
            return cartRepository.save(cart);
        });
    }

    private User getCurrentUser() {
        String email = getCurrentUserEmail();

        return userRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return authentication.getName();
    }
}
