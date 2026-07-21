package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderItem;
import com.nguyendat.ecommerce.entity.Payment;
import com.nguyendat.ecommerce.entity.ProductVariant;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.enums.PaymentStatus;
import com.nguyendat.ecommerce.enums.ShippingStatus;
import com.nguyendat.ecommerce.repository.OrderRepository;
import com.nguyendat.ecommerce.service.CouponApplicationService;
import com.nguyendat.ecommerce.service.OrderCreationService;
import com.nguyendat.ecommerce.service.OrderPaymentService;
import com.nguyendat.ecommerce.service.OrderStatusHistoryService;

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
    OrderStatusHistoryService orderStatusHistoryService;

    @Override
    @Transactional
    public Order create(User user, CheckoutRequest request, CheckoutCalculation checkout) {
        Order order = buildOrder(user, request, checkout);
        Order savedOrder = orderRepository.save(order);

        Payment payment;
        if (request.getPaymentMethod() == PaymentMethod.BANK_TRANSFER) {
            payment = orderPaymentService.createBankTransferPayment(savedOrder);
        } else {
            payment = orderPaymentService.createCodPayment(savedOrder);
        }
        savedOrder.setPayment(payment);

        for (com.nguyendat.ecommerce.dto.internal.CheckoutItem item : checkout.getItems()) {
            savedOrder.getItems().add(buildOrderItem(savedOrder, item));
        }

        couponApplicationService.recordUsage(
                savedOrder, user, new CouponCalculation(checkout.getCoupon(), checkout.getDiscountAmount()));

        Order finalOrder = orderRepository.save(savedOrder);
        orderStatusHistoryService.record(finalOrder, user, null, OrderStatus.PENDING, "Customer placed order");

        return finalOrder;
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

    private OrderItem buildOrderItem(Order order, com.nguyendat.ecommerce.dto.internal.CheckoutItem checkoutItem) {
        ProductVariant variant = checkoutItem.getVariant();
        BigDecimal unitPrice = checkoutItem.getUnitPrice();
        Integer quantity = checkoutItem.getQuantity();

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

