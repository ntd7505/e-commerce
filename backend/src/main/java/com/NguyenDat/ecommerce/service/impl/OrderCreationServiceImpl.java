package com.NguyenDat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.enums.ShippingStatus;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.service.CouponApplicationService;
import com.NguyenDat.ecommerce.service.OrderCreationService;
import com.NguyenDat.ecommerce.service.OrderPaymentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderCreationServiceImpl implements OrderCreationService {

    OrderRepository orderRepository;
    OrderPaymentService orderPaymentService;
    CouponApplicationService couponApplicationService;

    @Override
    @Transactional
    public Order create(User user, CheckoutRequest request, CheckoutCalculation checkout) {
        Order order = buildOrder(user, request, checkout);
        Order savedOrder = orderRepository.save(order);

        Payment payment = orderPaymentService.createCodPayment(savedOrder);
        savedOrder.setPayment(payment);

        for (CartItem selectedCartItem : checkout.getSelectedCartItems()) {
            savedOrder.getItems().add(buildOrderItem(savedOrder, selectedCartItem));
        }

        couponApplicationService.recordUsage(
                savedOrder,
                user,
                new CouponCalculation(checkout.getCoupon(), checkout.getDiscountAmount()));

        return orderRepository.save(savedOrder);
    }

    private Order buildOrder(User user, CheckoutRequest request, CheckoutCalculation checkout) {
        Order order = new Order();
        order.setUser(user);
        order.setAddress(checkout.getAddress());
        order.setCoupon(checkout.getCoupon());
        order.setRecipientName(checkout.getAddress().getRecipientName());
        order.setShippingAddress(checkout.getAddress().getFullAddress());
        order.setPhoneNumber(checkout.getAddress().getPhoneNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setShippingStatus(ShippingStatus.NOT_SHIPPED);
        order.setSubtotalAmount(checkout.getSubtotalAmount());
        order.setShippingFee(checkout.getShippingFee());
        order.setDiscountAmount(checkout.getDiscountAmount());
        order.setTotalAmount(checkout.getTotalAmount());
        order.setNote(request.getNote());
        return order;
    }

    private OrderItem buildOrderItem(Order order, CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        BigDecimal unitPrice = getCurrentPrice(variant);
        Integer quantity = cartItem.getQuantity();

        OrderItem orderItem = new OrderItem();
        orderItem.setProductVariant(variant);
        orderItem.setOrder(order);
        orderItem.setProductName(variant.getProduct().getName());
        orderItem.setVariantName(variant.getVariantName());
        orderItem.setSku(variant.getSku());
        orderItem.setQuantity(quantity);
        orderItem.setUnitPrice(unitPrice);
        orderItem.setLineTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)));
        return orderItem;
    }

    private BigDecimal getCurrentPrice(ProductVariant productVariant) {
        double price = productVariant.getSalePrice() > 0 ? productVariant.getSalePrice() : productVariant.getPrice();
        return BigDecimal.valueOf(price);
    }
}
