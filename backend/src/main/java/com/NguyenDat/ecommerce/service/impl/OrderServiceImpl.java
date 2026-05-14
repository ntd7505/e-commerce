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
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutItemResponse;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.enums.*;
import com.NguyenDat.ecommerce.mapper.AddressMapper;
import com.NguyenDat.ecommerce.mapper.CheckoutItemMapper;
import com.NguyenDat.ecommerce.mapper.OrderMapper;
import com.NguyenDat.ecommerce.repository.*;
import com.NguyenDat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
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
    OrderMapper orderMapper;
    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    OrderCancelRequestRepository orderCancelRequestRepository;

    public CheckoutPreviewResponse createCheckoutPreview(CheckoutPreviewRequest checkoutPreviewRequest) {
        User user = getCurrentUser();
        CheckoutCalculation checkoutCalculation = calculateCheckout(
                user,
                checkoutPreviewRequest.getCartItemIds(),
                checkoutPreviewRequest.getAddressId(),
                checkoutPreviewRequest.getCouponCode());
        List<CheckoutItemResponse> checkoutItemResponses = checkoutCalculation.getSelectedCartItems().stream()
                .map(checkoutItemMapper::toCheckoutItemResponse)
                .toList();
        return CheckoutPreviewResponse.builder()
                .shippingAddress(addressMapper.toAddressResponse(checkoutCalculation.getAddress()))
                .items(checkoutItemResponses)
                .subtotalAmount(checkoutCalculation.getSubtotalAmount())
                .shippingFee(checkoutCalculation.getShippingFee())
                .discountAmount(checkoutCalculation.getDiscountAmount())
                .totalAmount(checkoutCalculation.getTotalAmount())
                .totalItems(checkoutCalculation.getTotalItems())
                .paymentMethods(List.of(PaymentMethod.COD))
                .selectedCouponCode(
                        checkoutCalculation.getCoupon() == null
                                ? null
                                : checkoutCalculation.getCoupon().getCode())
                .build();
    }

    @Transactional
    public OrderResponse createOrder(CheckoutRequest checkoutRequest) {
        if (checkoutRequest.getPaymentMethod() != PaymentMethod.COD) {
            throw new AppException(ErrorCode.PAYMENT_METHOD_UNSUPPORTED);
        }
        User user = getCurrentUser();
        CheckoutCalculation checkoutCalculation = calculateCheckout(
                user,
                checkoutRequest.getCartItemIds(),
                checkoutRequest.getAddressId(),
                checkoutRequest.getCouponCode());

        Order order = new Order();
        order.setUser(user);
        order.setAddress(checkoutCalculation.getAddress());
        order.setCoupon(checkoutCalculation.getCoupon());

        order.setRecipientName(checkoutCalculation.getAddress().getRecipientName());
        order.setShippingAddress(checkoutCalculation.getAddress().getFullAddress());
        order.setPhoneNumber(checkoutCalculation.getAddress().getPhoneNumber());

        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setShippingStatus(ShippingStatus.PENDING);

        order.setSubtotalAmount(checkoutCalculation.getSubtotalAmount());
        order.setShippingFee(checkoutCalculation.getShippingFee());
        order.setDiscountAmount(checkoutCalculation.getDiscountAmount());
        order.setTotalAmount(checkoutCalculation.getTotalAmount());

        order.setNote(checkoutRequest.getNote());

        Order savedOrder = orderRepository.save(order);

        for (CartItem selectedCartItem : checkoutCalculation.getSelectedCartItems()) {
            ProductVariant variant = selectedCartItem.getProductVariant();
            BigDecimal unitPrice = getCurrentPrice(variant);
            Integer quantity = selectedCartItem.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setProductVariant(variant);
            orderItem.setOrder(savedOrder);

            orderItem.setProductName(variant.getProduct().getName());
            orderItem.setVariantName(variant.getVariantName());
            orderItem.setSku(variant.getSku());

            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setLineTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)));

            savedOrder.getItems().add(orderItem);
        }

        return orderMapper.toOrderResponse(orderRepository.save(savedOrder));
    }

    @Override
    public OrderResponse getMyOrderById(Long orderId) {
        User user = getCurrentUser();

        Order order = orderRepository
                .findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return orderMapper.toOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getMyOrder() {
        User user = getCurrentUser();
        return orderRepository.findAllByUserId(user.getId()).stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    @Override
    public OrderResponse cancelMyOrder(OrderCancelRequestRequest orderCancelRequestRequest, Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository
                .findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_CANCEL_NOT_ALLOWED);
        }

        if (orderCancelRequestRepository.existsByOrderId(orderId)) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REQUEST_EXISTED);
        }

        String normalizedReason = orderCancelRequestRequest.getReason().trim();
        if (normalizedReason.isBlank()) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REASON_INVALID);
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setShippingStatus(ShippingStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.CANCELLED);

        Order savedOrder = orderRepository.save(order);

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setOrder(savedOrder);
        orderCancelRequest.setRequestedBy(user);
        orderCancelRequest.setReason(normalizedReason);
        orderCancelRequest.setStatus(CancelRequestStatus.APPROVED);

        orderCancelRequestRepository.save(orderCancelRequest);

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse confirmReceived(Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository
                .findDeliveredOrder(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(OrderStatus.COMPLETED);
        order.setPaymentStatus(PaymentStatus.PAID);
        return orderMapper.toOrderResponse(orderRepository.save(order));
    }

    private CheckoutCalculation calculateCheckout(
            User user, List<Long> cartItemIds, Long addressId, String couponCode) {
        Cart cart =
                cartRepository.findByUserId(user.getId()).orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
        if (cartItemIds == null || cartItemIds.isEmpty()) {
            throw new AppException(ErrorCode.CART_ITEMS_REQUIRED);
        }
        List<CartItem> selectedCartItemList = new ArrayList<>();
        for (Long cartItemId : cartItemIds) {
            selectedCartItemList.add(cartItemRepository
                    .findByIdAndCartId(cartItemId, cart.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND)));
        }

        for (CartItem cartItem : selectedCartItemList) {
            if (cartItem.getQuantity() > cartItem.getProductVariant().getStockQuantity()) {
                throw new AppException(ErrorCode.CHECKOUT_CART_ITEM_OUT_OF_STOCK);
            }
        }

        Address address;
        if (addressId == null) {
            address = addressRepository
                    .findByUserIdAndIsDefaultTrueAndDeletedFalse(user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        } else {
            address = addressRepository
                    .findByIdAndUserIdAndDeletedFalse(addressId, user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        }

        BigDecimal subtotalAmount = calculateSubtotalAmount(selectedCartItemList);
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (couponCode != null) {
            couponCode = couponCode.trim();
            if (couponCode.isBlank()) {
                couponCode = null;
            }
        }
        if (couponCode != null) {
            coupon = couponRepository
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
        return CheckoutCalculation.builder()
                .selectedCartItems(selectedCartItemList)
                .cart(cart)
                .address(address)
                .subtotalAmount(subtotalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .coupon(coupon)
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
                .map(cartItem -> {
                    BigDecimal unitPrice = getCurrentPrice(cartItem.getProductVariant());
                    return unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getCurrentPrice(ProductVariant productVariant) {
        double price = productVariant.getSalePrice() > 0 ? productVariant.getSalePrice() : productVariant.getPrice();
        return BigDecimal.valueOf(price);
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

    @Getter
    @Builder
    private static class CheckoutCalculation {
        Cart cart;
        List<CartItem> selectedCartItems;
        Address address;
        Coupon coupon;

        BigDecimal subtotalAmount;
        BigDecimal shippingFee;
        BigDecimal discountAmount;
        BigDecimal totalAmount;

        Integer totalItems;
    }
}
