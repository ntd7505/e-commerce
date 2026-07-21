package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.internal.CheckoutItem;
import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.dto.request.BuyNowCheckoutRequest;
import com.nguyendat.ecommerce.dto.request.BuyNowPreviewRequest;
import com.nguyendat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.entity.Address;
import com.nguyendat.ecommerce.entity.Cart;
import com.nguyendat.ecommerce.entity.CartItem;
import com.nguyendat.ecommerce.entity.Product;
import com.nguyendat.ecommerce.entity.ProductVariant;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.repository.AddressRepository;
import com.nguyendat.ecommerce.repository.CartItemRepository;
import com.nguyendat.ecommerce.repository.CartRepository;
import com.nguyendat.ecommerce.repository.ProductVariantRepository;
import com.nguyendat.ecommerce.service.CheckoutService;
import com.nguyendat.ecommerce.service.CouponApplicationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CheckoutServiceImpl implements CheckoutService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    ProductVariantRepository productVariantRepository;
    AddressRepository addressRepository;
    CouponApplicationService couponApplicationService;

    @Override
    public CheckoutCalculation calculateForPreview(User user, CheckoutPreviewRequest request) {
        List<CheckoutItem> checkoutItems = getCheckoutItemsFromCart(user, request.getCartItemIds());
        return calculate(user, checkoutItems, request.getAddressId(), request.getCouponCode(), false);
    }

    @Override
    public CheckoutCalculation calculateForOrder(User user, CheckoutRequest request) {
        List<CheckoutItem> checkoutItems = getCheckoutItemsFromCart(user, request.getCartItemIds());
        return calculate(user, checkoutItems, request.getAddressId(), request.getCouponCode(), true);
    }

    @Override
    public CheckoutCalculation calculateBuyNowForPreview(User user, BuyNowPreviewRequest request) {
        List<CheckoutItem> checkoutItems =
                List.of(getCheckoutItemForBuyNow(request.getProductVariantId(), request.getQuantity()));
        return calculate(user, checkoutItems, request.getAddressId(), request.getCouponCode(), false);
    }

    @Override
    public CheckoutCalculation calculateBuyNowForOrder(User user, BuyNowCheckoutRequest request) {
        List<CheckoutItem> checkoutItems =
                List.of(getCheckoutItemForBuyNow(request.getProductVariantId(), request.getQuantity()));
        return calculate(user, checkoutItems, request.getAddressId(), request.getCouponCode(), true);
    }

    private CheckoutCalculation calculate(
            User user, List<CheckoutItem> checkoutItems, Long addressId, String couponCode, boolean lockCoupon) {

        validateCheckoutItems(checkoutItems);

        Address address = getCheckoutAddress(user, addressId);
        BigDecimal subtotalAmount = calculateSubtotalAmount(checkoutItems);
        CouponCalculation couponCalculation = calculateCoupon(couponCode, user, subtotalAmount, lockCoupon);
        BigDecimal shippingFee = calculateShippingFee(subtotalAmount);
        BigDecimal totalAmount = subtotalAmount.add(shippingFee).subtract(couponCalculation.discountAmount());
        int totalItems = checkoutItems.stream().map(CheckoutItem::getQuantity).reduce(0, Integer::sum);

        return CheckoutCalculation.builder()
                .items(checkoutItems)
                .address(address)
                .subtotalAmount(subtotalAmount)
                .shippingFee(shippingFee)
                .discountAmount(couponCalculation.discountAmount())
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .coupon(couponCalculation.coupon())
                .build();
    }

    private List<CheckoutItem> getCheckoutItemsFromCart(User user, List<Long> cartItemIds) {
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEMS_REQUIRED);
        }

        Cart cart =
                cartRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        List<CheckoutItem> checkoutItems = new ArrayList<>();
        for (Long cartItemId : cartItemIds) {
            CartItem cartItem = cartItemRepository
                    .findByIdAndCartId(cartItemId, cart.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

            checkoutItems.add(CheckoutItem.builder()
                    .variant(cartItem.getProductVariant())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(getCurrentPrice(cartItem.getProductVariant()))
                    .cartItemId(cartItem.getId())
                    .build());
        }
        return checkoutItems;
    }

    private CheckoutItem getCheckoutItemForBuyNow(Long productVariantId, Integer quantity) {
        ProductVariant variant = productVariantRepository
                .findById(productVariantId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        return CheckoutItem.builder()
                .variant(variant)
                .quantity(quantity)
                .unitPrice(getCurrentPrice(variant))
                .cartItemId(null)
                .build();
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

    private void validateCheckoutItems(List<CheckoutItem> items) {
        for (CheckoutItem item : items) {
            ProductVariant variant = item.getVariant();
            Product product = variant.getProduct();

            if (item.getQuantity() <= 0) {
                throw new AppException(ErrorCode.CART_ITEM_QUANTITY_INVALID);
            }

            if (variant.isDeleted() || !variant.isActive() || product.isDeleted() || !product.isActive()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_INVALID);
            }

            if (item.getQuantity() > variant.getStockQuantity()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_OUT_OF_STOCK);
            }
        }
    }

    private BigDecimal calculateShippingFee(BigDecimal subtotalAmount) {
        BigDecimal freeShippingThreshold = BigDecimal.valueOf(500000);
        BigDecimal standardShippingFee = BigDecimal.valueOf(30000);

        return subtotalAmount.compareTo(freeShippingThreshold) >= 0 ? BigDecimal.ZERO : standardShippingFee;
    }

    private BigDecimal calculateSubtotalAmount(List<CheckoutItem> items) {
        return items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getCurrentPrice(ProductVariant productVariant) {
        double price = productVariant.getSalePrice() > 0 ? productVariant.getSalePrice() : productVariant.getPrice();
        return BigDecimal.valueOf(price);
    }
}

