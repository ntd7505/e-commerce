package com.NguyenDat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutItemResponse;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.enums.DiscountType;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.mapper.AddressMapper;
import com.NguyenDat.ecommerce.mapper.CheckoutItemMapper;
import com.NguyenDat.ecommerce.repository.*;
import com.NguyenDat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    UserRepository userRepository;
    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    CheckoutItemMapper checkoutItemMapper;
    AddressMapper addressMapper;
    AddressRepository addressRepository;
    CouponRepository couponRepository;

    public CheckoutPreviewResponse createCheckoutPreview(CheckoutPreviewRequest checkoutPreviewRequest) {
        String couponCode = checkoutPreviewRequest.getCouponCode();
        if (couponCode != null) {
            couponCode = couponCode.trim();
        }
        if (couponCode != null && couponCode.isBlank()) {
            couponCode = null;
        }
        User user = getCurrentUser();
        Cart cart =
                cartRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
        if (checkoutPreviewRequest.getCartItemIds() == null
                || checkoutPreviewRequest.getCartItemIds().isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEMS_REQUIRED);
        }
        List<CartItem> selectedCartItemList = new ArrayList<>();
        for (Long cartItemId : checkoutPreviewRequest.getCartItemIds()) {
            selectedCartItemList.add(cartItemRepository
                    .findByIdAndCartId(cartItemId, cart.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND)));
        }

        for (CartItem cartItem : selectedCartItemList) {
            if (cartItem.getQuantity() > cartItem.getProductVariant().getStockQuantity()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_OUT_OF_STOCK);
            }
        }

        List<CheckoutItemResponse> checkoutItemResponses = selectedCartItemList.stream()
                .map(checkoutItemMapper::toCheckoutItemResponse)
                .toList();
        Address address;
        if (checkoutPreviewRequest.getAddressId() == null) {
            address = addressRepository
                    .findByUserIdAndIsDefaultTrueAndDeletedFalse(user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        } else {
            address = addressRepository
                    .findByIdAndUserIdAndDeletedFalse(checkoutPreviewRequest.getAddressId(), user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        }

        BigDecimal subtotalAmount = calculateSubtotalAmount(selectedCartItemList);
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (couponCode != null) {
            Coupon coupon = couponRepository
                    .findByCodeAndDeletedFalseAndActiveTrue(couponCode)
                    .orElseThrow(() -> new AppException(ErrorCode.COUPON_CODE_INVALID));
            if (coupon.getDiscountType().equals(DiscountType.PERCENT)) {
                discountAmount = subtotalAmount.multiply(
                        coupon.getDiscountValue().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            } else if (coupon.getDiscountType().equals(DiscountType.FIXED_AMOUNT)) {
                discountAmount = coupon.getDiscountValue();
            }
            discountAmount = discountAmount.min(subtotalAmount);
        }
        BigDecimal shippingFee = calculateShippingFee(subtotalAmount);
        BigDecimal totalAmount = subtotalAmount.add(shippingFee).subtract(discountAmount);
        int totalItems =
                selectedCartItemList.stream().map(CartItem::getQuantity).reduce(0, Integer::sum);
        return CheckoutPreviewResponse.builder()
                .shippingAddress(addressMapper.toAddressResponse(address))
                .items(checkoutItemResponses)
                .subtotalAmount(subtotalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .paymentMethods(List.of(PaymentMethod.COD))
                .selectedCouponCode(couponCode)
                .build();
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotalAmount) {
        BigDecimal freeShippingThreshold = BigDecimal.valueOf(500000);
        BigDecimal standardShippingFee = BigDecimal.valueOf(30000);

        if (subtotalAmount.compareTo(freeShippingThreshold) >= 0) {
            return BigDecimal.ZERO;
        }

        return standardShippingFee;
    }

    private BigDecimal calculateSubtotalAmount(List<CartItem> cartItems) {
        if (cartItems == null) {
            return BigDecimal.ZERO;
        }
        return cartItems.stream()
                .map(cartItem -> cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
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
