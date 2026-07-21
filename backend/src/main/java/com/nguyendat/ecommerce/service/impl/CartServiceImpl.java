package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.CartItemRequest;
import com.nguyendat.ecommerce.dto.request.CartItemUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CartResponse;
import com.nguyendat.ecommerce.entity.Cart;
import com.nguyendat.ecommerce.entity.CartItem;
import com.nguyendat.ecommerce.entity.ProductVariant;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.CartStatus;
import com.nguyendat.ecommerce.mapper.CartMapper;
import com.nguyendat.ecommerce.repository.CartItemRepository;
import com.nguyendat.ecommerce.repository.CartRepository;
import com.nguyendat.ecommerce.repository.ProductVariantRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.CartService;

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
    @Transactional
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

    @Override
    public CartResponse previewGuestCart(com.nguyendat.ecommerce.dto.request.GuestCartRequest request) {
        Cart cart = new Cart();
        cart.setStatus(CartStatus.ACTIVE);
        cart.setItems(new java.util.ArrayList<>());

        for (com.nguyendat.ecommerce.dto.request.GuestCartItemRequest itemReq : request.getItems()) {
            ProductVariant productVariant = productVariantRepository
                    .findSellableVariantById(itemReq.getProductVariantId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

            int clampedQuantity = Math.min(itemReq.getQuantity(), productVariant.getStockQuantity());
            if (clampedQuantity > 0) {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProductVariant(productVariant);
                cartItem.setQuantity(clampedQuantity);
                cartItem.setUnitPrice(BigDecimal.valueOf(getCurrentPrice(productVariant)));
                cart.getItems().add(cartItem);
            }
        }

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse mergeGuestCart(com.nguyendat.ecommerce.dto.request.GuestCartRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        for (com.nguyendat.ecommerce.dto.request.GuestCartItemRequest itemReq : request.getItems()) {
            try {
                ProductVariant productVariant = productVariantRepository
                        .findSellableVariantById(itemReq.getProductVariantId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

                CartItem cartItem = cartItemRepository
                        .findByCartIdAndProductVariantId(cart.getId(), productVariant.getId())
                        .orElseGet(() -> {
                            CartItem item = new CartItem();
                            item.setCart(cart);
                            cart.getItems().add(item);
                            item.setProductVariant(productVariant);
                            item.setQuantity(0);
                            return item;
                        });

                int newQuantity = cartItem.getQuantity() + itemReq.getQuantity();
                int clampedQuantity = Math.min(newQuantity, productVariant.getStockQuantity());

                if (clampedQuantity > 0) {
                    cartItem.setQuantity(clampedQuantity);
                    cartItem.setUnitPrice(BigDecimal.valueOf(getCurrentPrice(productVariant)));
                    cartItemRepository.save(cartItem);
                } else if (cartItem.getId() != null) {
                    // if clamped to 0 (e.g. stock is 0), maybe remove from cart?
                    cartItemRepository.delete(cartItem);
                    cart.getItems().remove(cartItem);
                }
            } catch (AppException e) {
                // Ignore items that are not found or inactive during merge
                continue;
            }
        }

        return cartMapper.toCartResponse(cart);
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

