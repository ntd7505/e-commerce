package com.NguyenDat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.entity.Address;
import com.NguyenDat.ecommerce.entity.Cart;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.Product;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.repository.AddressRepository;
import com.NguyenDat.ecommerce.repository.CartItemRepository;
import com.NguyenDat.ecommerce.repository.CartRepository;
import com.NguyenDat.ecommerce.service.CheckoutService;
import com.NguyenDat.ecommerce.service.CouponApplicationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CheckoutServiceImpl implements CheckoutService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    AddressRepository addressRepository;
    CouponApplicationService couponApplicationService;

    @Override
    public CheckoutCalculation calculateForPreview(User user, CheckoutPreviewRequest request) {
        return calculate(user, request.getCartItemIds(), request.getAddressId(), request.getCouponCode(), false);
    }

    @Override
    public CheckoutCalculation calculateForOrder(User user, CheckoutRequest request) {
        return calculate(user, request.getCartItemIds(), request.getAddressId(), request.getCouponCode(), true);
    }

    private CheckoutCalculation calculate(
            User user, List<Long> cartItemIds, Long addressId, String couponCode, boolean lockCoupon) {
        Cart cart =
                cartRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        List<CartItem> selectedCartItems = getSelectedCartItems(cart, cartItemIds);
        validateSelectedCartItems(selectedCartItems);

        Address address = getCheckoutAddress(user, addressId);
        BigDecimal subtotalAmount = calculateSubtotalAmount(selectedCartItems);
        CouponCalculation couponCalculation = calculateCoupon(couponCode, user, subtotalAmount, lockCoupon);
        BigDecimal shippingFee = calculateShippingFee(subtotalAmount);
        BigDecimal totalAmount = subtotalAmount.add(shippingFee).subtract(couponCalculation.discountAmount());
        int totalItems = selectedCartItems.stream().map(CartItem::getQuantity).reduce(0, Integer::sum);

        return CheckoutCalculation.builder()
                .selectedCartItems(selectedCartItems)
                .cart(cart)
                .address(address)
                .subtotalAmount(subtotalAmount)
                .shippingFee(shippingFee)
                .discountAmount(couponCalculation.discountAmount())
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .coupon(couponCalculation.coupon())
                .build();
    }

    private List<CartItem> getSelectedCartItems(Cart cart, List<Long> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEMS_REQUIRED);
        }

        List<CartItem> selectedCartItems = new ArrayList<>();
        for (Long cartItemId : cartItemIds) {
            selectedCartItems.add(cartItemRepository
                    .findByIdAndCartId(cartItemId, cart.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND)));
        }
        return selectedCartItems;
    }

    private Address getCheckoutAddress(User user, Long addressId) {
        if (addressId == null) {
            return addressRepository
                    .findByUserIdAndIsDefaultTrueAndDeletedFalse(user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        }

        return addressRepository
                .findByIdAndUserIdAndDeletedFalse(addressId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    private CouponCalculation calculateCoupon(
            String couponCode, User user, BigDecimal subtotalAmount, boolean lockCoupon) {
        if (couponCode == null || couponCode.isBlank()) {
            return CouponCalculation.empty();
        }

        return lockCoupon
                ? couponApplicationService.calculateForOrder(couponCode, user, subtotalAmount)
                : couponApplicationService.calculateForPreview(couponCode, user, subtotalAmount);
    }

    private void validateSelectedCartItems(List<CartItem> cartItems) {
        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();
            Product product = variant.getProduct();

            if (cartItem.getQuantity() <= 0) {
                throw new AppException(ErrorCode.CART_ITEM_QUANTITY_INVALID);
            }

            if (variant.isDeleted() || !variant.isActive() || product.isDeleted() || !product.isActive()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_INVALID);
            }

            if (cartItem.getQuantity() > variant.getStockQuantity()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_OUT_OF_STOCK);
            }
        }
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotalAmount) {
        BigDecimal freeShippingThreshold = BigDecimal.valueOf(500000);
        BigDecimal standardShippingFee = BigDecimal.valueOf(30000);

        return subtotalAmount.compareTo(freeShippingThreshold) >= 0 ? BigDecimal.ZERO : standardShippingFee;
    }

    private BigDecimal calculateSubtotalAmount(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(cartItem -> getCurrentPrice(cartItem.getProductVariant())
                        .multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getCurrentPrice(ProductVariant productVariant) {
        double price = productVariant.getSalePrice() > 0 ? productVariant.getSalePrice() : productVariant.getPrice();
        return BigDecimal.valueOf(price);
    }
}
