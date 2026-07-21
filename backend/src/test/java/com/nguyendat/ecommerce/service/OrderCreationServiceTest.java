package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.entity.*;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.enums.PaymentStatus;
import com.nguyendat.ecommerce.repository.OrderRepository;
import com.nguyendat.ecommerce.service.impl.OrderCreationServiceImpl;

@ExtendWith(MockitoExtension.class)
class OrderCreationServiceTest {

    @Mock
    OrderRepository orderRepository;

    @Mock
    OrderPaymentService orderPaymentService;

    @Mock
    CouponApplicationService couponApplicationService;

    @Mock
    OrderStatusHistoryService orderStatusHistoryService;

    @InjectMocks
    OrderCreationServiceImpl orderCreationService;

    User user;
    Address address;
    com.nguyendat.ecommerce.dto.internal.CheckoutItem checkoutItem;
    Coupon coupon;
    CheckoutCalculation checkout;
    CheckoutRequest request;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();

        address = new Address();
        address.setRecipientName("Nguyen Dat");
        address.setPhoneNumber("0900000000");
        address.setFullAddress("Ho Chi Minh City");

        Product product = new Product();
        product.setName("Keyboard");

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setVariantName("Black");
        variant.setSku("KB-BLACK");
        variant.setPrice(100_000);

        checkoutItem = new com.nguyendat.ecommerce.dto.internal.CheckoutItem();
        checkoutItem.setVariant(variant);
        checkoutItem.setQuantity(2);
        checkoutItem.setUnitPrice(BigDecimal.valueOf(100_000));

        coupon = new Coupon();
        checkout = CheckoutCalculation.builder()
                .items(List.of(checkoutItem))
                .address(address)
                .coupon(coupon)
                .subtotalAmount(BigDecimal.valueOf(200_000))
                .shippingFee(BigDecimal.valueOf(30_000))
                .discountAmount(BigDecimal.valueOf(20_000))
                .totalAmount(BigDecimal.valueOf(210_000))
                .totalItems(2)
                .build();
        request = CheckoutRequest.builder()
                .paymentMethod(PaymentMethod.COD)
                .note("Call before delivery")
                .build();
    }

    @Test
    void create_shouldBuildOrderItemsPaymentAndRecordCouponUsage() {
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderPaymentService.createCodPayment(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            Payment payment = new Payment();
            payment.setOrder(order);
            return payment;
        });

        Order result = orderCreationService.create(user, request, checkout);

        assertEquals(user, result.getUser());
        assertEquals(address, result.getAddress());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(PaymentStatus.UNPAID, result.getPaymentStatus());
        assertEquals("Call before delivery", result.getNote());
        assertNotNull(result.getPayment());
        assertEquals(1, result.getItems().size());
        assertEquals(BigDecimal.valueOf(200_000), result.getItems().getFirst().getLineTotal());
        verify(orderRepository, times(2)).save(result);
        verify(couponApplicationService).recordUsage(eq(result), eq(user), any(CouponCalculation.class));
        verify(orderStatusHistoryService).record(result, user, null, OrderStatus.PENDING, "Customer placed order");
    }
}

