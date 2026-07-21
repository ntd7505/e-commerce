package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.response.AddressResponse;
import com.NguyenDat.ecommerce.dto.response.CheckoutItemResponse;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.enums.*;
import com.NguyenDat.ecommerce.mapper.AddressMapper;
import com.NguyenDat.ecommerce.mapper.CheckoutItemMapper;
import com.NguyenDat.ecommerce.mapper.OrderMapper;
import com.NguyenDat.ecommerce.repository.OrderCancelRequestRepository;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.service.impl.OrderServiceImpl;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    CheckoutItemMapper checkoutItemMapper;

    @Mock
    AddressMapper addressMapper;

    @Mock
    OrderMapper orderMapper;

    @Mock
    OrderRepository orderRepository;

    @Mock
    OrderCancelRequestRepository orderCancelRequestRepository;

    @Mock
    CouponApplicationService couponApplicationService;

    @Mock
    CheckoutService checkoutService;

    @Mock
    CurrentUserService currentUserService;

    @Mock
    InventoryService inventoryService;

    @Mock
    OrderPaymentService orderPaymentService;

    @Mock
    OrderCreationService orderCreationService;

    @Mock
    OrderStatusHistoryService orderStatusHistoryService;

    @InjectMocks
    OrderServiceImpl orderService;

    @Test
    void createOrder_shouldRejectUnsupportedPaymentMethod() {
        CheckoutRequest request =
                CheckoutRequest.builder().paymentMethod(PaymentMethod.VNPAY).build();

        AppException exception = assertThrows(AppException.class, () -> orderService.createOrder(request));

        assertEquals(ErrorCode.PAYMENT_METHOD_UNSUPPORTED, exception.getErrorCode());
        verifyNoInteractions(currentUserService, checkoutService, orderCreationService);
    }

    @Test
    void createOrder_shouldDelegateCheckoutAndOrderCreationForCod() {
        User user = User.builder().id(1L).build();
        CheckoutRequest request =
                CheckoutRequest.builder().paymentMethod(PaymentMethod.COD).build();
        CheckoutCalculation checkout = CheckoutCalculation.builder().build();
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(checkoutService.calculateForOrder(user, request)).thenReturn(checkout);
        when(orderCreationService.create(user, request, checkout)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        OrderResponse result = orderService.createOrder(request);

        assertEquals(response, result);
        verify(inventoryService).decreaseForOrder(order, user);
        verify(checkoutService).calculateForOrder(user, request);
        verify(orderCreationService).create(user, request, checkout);
    }

    @Test
    void confirmOrder_shouldTransitionPendingOrderWithoutDecreasingStockAgain() {
        User admin = User.builder().id(1L).build();
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(java.util.Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        OrderResponse result = orderService.confirmOrder(10L);

        assertEquals(response, result);
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertEquals(ShippingStatus.PREPARING, order.getShippingStatus());
        verifyNoInteractions(inventoryService);
        verify(orderStatusHistoryService)
                .record(order, admin, OrderStatus.PENDING, OrderStatus.CONFIRMED, "Admin confirmed order");
    }

    @Test
    void createCheckoutPreview_shouldMapCalculationAndCoupon() {
        User user = User.builder().id(1L).build();
        CheckoutPreviewRequest request = CheckoutPreviewRequest.builder().build();
        CartItem cartItem = new CartItem();
        CheckoutItemResponse itemResponse = new CheckoutItemResponse();
        Address address = new Address();
        AddressResponse addressResponse = new AddressResponse();
        Coupon coupon = new Coupon();
        coupon.setCode("SALE10");
        
        com.NguyenDat.ecommerce.dto.internal.CheckoutItem checkoutItem = new com.NguyenDat.ecommerce.dto.internal.CheckoutItem();
        checkoutItem.setVariant(new ProductVariant());
        checkoutItem.setQuantity(2);
        
        CheckoutCalculation checkout = CheckoutCalculation.builder()
                .items(List.of(checkoutItem))
                .address(address)
                .coupon(coupon)
                .totalItems(2)
                .build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(checkoutService.calculateForPreview(user, request)).thenReturn(checkout);
        when(checkoutItemMapper.toCheckoutItemResponse(checkoutItem)).thenReturn(itemResponse);
        when(addressMapper.toAddressResponse(address)).thenReturn(addressResponse);

        CheckoutPreviewResponse result = orderService.createCheckoutPreview(request);

        assertEquals(List.of(itemResponse), result.getItems());
        assertEquals(addressResponse, result.getShippingAddress());
        assertEquals("SALE10", result.getSelectedCouponCode());
        assertEquals(List.of(PaymentMethod.COD, PaymentMethod.BANK_TRANSFER), result.getPaymentMethods());
    }

    @Test
    void getMyOrderById_shouldReturnOwnedOrder() {
        User user = User.builder().id(1L).build();
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(order));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        assertEquals(response, orderService.getMyOrderById(10L));
    }

    @Test
    void getMyOrderById_shouldRejectMissingOrder() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.empty());

        assertError(ErrorCode.ORDER_NOT_FOUND, () -> orderService.getMyOrderById(10L));
    }

    @Test
    void getMyOrdersInPage_shouldMapPageMetadataAndContent() {
        User user = User.builder().id(1L).build();
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        PageRequest pageable = PageRequest.of(0, 10);
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findAllByUserId(1L, pageable)).thenReturn(new PageImpl<>(List.of(order), pageable, 1));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        PageResponse<OrderResponse> result = orderService.getMyOrdersInPage(pageable);

        assertEquals(List.of(response), result.getContent());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getMyOrder_shouldMapAllOwnedOrders() {
        User user = User.builder().id(1L).build();
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findAllByUserId(1L)).thenReturn(List.of(order));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        assertEquals(List.of(response), orderService.getMyOrder());
    }

    @Test
    void cancelMyOrder_shouldCancelPendingOrderAndCreateApprovedRequest() {
        User user = User.builder().id(1L).build();
        Order order = orderWithStatus(OrderStatus.PENDING);
        OrderResponse response = OrderResponse.builder().id(10L).build();
        OrderCancelRequestRequest request = OrderCancelRequestRequest.builder()
                .reason("  Changed my mind  ")
                .build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        OrderResponse result = orderService.cancelMyOrder(request, 10L);

        assertEquals(response, result);
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        assertEquals(ShippingStatus.CANCELLED, order.getShippingStatus());
        assertEquals(PaymentStatus.CANCELLED, order.getPaymentStatus());
        assertNotNull(order.getCancelledAt());
        verify(couponApplicationService).reverseUsage(order);
        verify(inventoryService).restoreForOrder(order, user);
        verify(orderPaymentService).markCancelled(order);
        verify(orderCancelRequestRepository)
                .save(argThat(cancelRequest -> cancelRequest.getStatus() == CancelRequestStatus.APPROVED
                        && cancelRequest.getReason().equals("Changed my mind")
                        && cancelRequest.getRequestedBy() == user));
    }

    @Test
    void cancelMyOrder_shouldRejectNonPendingOrder() {
        User user = User.builder().id(1L).build();
        Order order = orderWithStatus(OrderStatus.CONFIRMED);
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L)).thenReturn(Optional.of(order));

        assertError(
                ErrorCode.ORDER_CANCEL_NOT_ALLOWED,
                () -> orderService.cancelMyOrder(
                        OrderCancelRequestRequest.builder().reason("reason").build(), 10L));
        verifyNoInteractions(couponApplicationService, orderPaymentService);
    }

    @Test
    void cancelMyOrder_shouldRejectDuplicateCancelRequest() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L))
                .thenReturn(Optional.of(orderWithStatus(OrderStatus.PENDING)));
        when(orderCancelRequestRepository.existsByOrderId(10L)).thenReturn(true);

        assertError(
                ErrorCode.ORDER_CANCEL_REQUEST_EXISTED,
                () -> orderService.cancelMyOrder(
                        OrderCancelRequestRequest.builder().reason("reason").build(), 10L));
    }

    @Test
    void cancelMyOrder_shouldRejectBlankReason() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L))
                .thenReturn(Optional.of(orderWithStatus(OrderStatus.PENDING)));

        assertError(
                ErrorCode.ORDER_CANCEL_REASON_INVALID,
                () -> orderService.cancelMyOrder(
                        OrderCancelRequestRequest.builder().reason("   ").build(), 10L));
    }

    @Test
    void confirmReceived_shouldCompleteDeliveredOrderAndMarkPaymentPaid() {
        User user = User.builder().id(1L).build();
        Order order = orderWithStatus(OrderStatus.DELIVERED);
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findDeliveredOrderForUpdate(10L, 1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        assertEquals(response, orderService.confirmReceived(10L));
        assertEquals(OrderStatus.COMPLETED, order.getStatus());
        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
        verify(orderPaymentService).markPaid(order);
        verify(orderStatusHistoryService)
                .record(order, user, OrderStatus.DELIVERED, OrderStatus.COMPLETED, "User confirmed received order");
    }

    @Test
    void confirmReceived_shouldRejectMissingDeliveredOrder() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findDeliveredOrderForUpdate(10L, 1L)).thenReturn(Optional.empty());

        assertError(ErrorCode.ORDER_NOT_FOUND, () -> orderService.confirmReceived(10L));
    }

    @Test
    void getAllOrders_shouldMapRepositoryResults() {
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(orderRepository.findAll()).thenReturn(List.of(order));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        assertEquals(List.of(response), orderService.getAllOrders());
    }

    @Test
    void getOrdersInPage_shouldMapRepositoryPage() {
        Order order = new Order();
        OrderResponse response = OrderResponse.builder().id(10L).build();
        PageRequest pageable = PageRequest.of(0, 10);
        when(orderRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(order), pageable, 1));
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        PageResponse<OrderResponse> result = orderService.getOrdersInPage(pageable);

        assertEquals(List.of(response), result.getContent());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getOrderById_shouldRejectMissingOrder() {
        when(orderRepository.findById(10L)).thenReturn(Optional.empty());

        assertError(ErrorCode.ORDER_NOT_FOUND, () -> orderService.getOrderById(10L));
    }

    @Test
    void processOrder_shouldTransitionConfirmedOrder() {
        assertAdminTransition(
                OrderStatus.CONFIRMED,
                OrderStatus.PROCESSING,
                ShippingStatus.PREPARING,
                () -> orderService.processOrder(10L),
                "Admin processed order");
    }

    @Test
    void shipOrder_shouldTransitionProcessingOrder() {
        assertAdminTransition(
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPING,
                ShippingStatus.SHIPPING,
                () -> orderService.shipOrder(10L),
                "Admin shipped order");
    }

    @Test
    void deliverOrder_shouldTransitionShippingOrder() {
        assertAdminTransition(
                OrderStatus.SHIPPING,
                OrderStatus.DELIVERED,
                ShippingStatus.DELIVERED,
                () -> orderService.deliverOrder(10L),
                "Admin delivered order");
    }

    @Test
    void processOrder_shouldRejectInvalidTransition() {
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(orderWithStatus(OrderStatus.PENDING)));

        assertError(ErrorCode.ORDER_STATUS_TRANSITION_INVALID, () -> orderService.processOrder(10L));
        verifyNoInteractions(currentUserService, orderStatusHistoryService);
    }

    @Test
    void confirmOrder_shouldRejectInvalidTransitionBeforeChangingInventory() {
        when(currentUserService.getCurrentUser())
                .thenReturn(User.builder().id(1L).build());
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(orderWithStatus(OrderStatus.CONFIRMED)));

        assertError(ErrorCode.ORDER_STATUS_TRANSITION_INVALID, () -> orderService.confirmOrder(10L));
        verifyNoInteractions(inventoryService);
    }

    @Test
    void requestOrderCancellation_shouldCreatePendingRequestForConfirmedOrder() {
        User user = User.builder().id(1L).build();
        Order order = orderWithStatus(OrderStatus.CONFIRMED);
        OrderCancelRequestResponse response =
                OrderCancelRequestResponse.builder().id(20L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L)).thenReturn(Optional.of(order));
        when(orderCancelRequestRepository.save(any(OrderCancelRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(orderMapper.toOrderCancelRequestResponse(any(OrderCancelRequest.class)))
                .thenReturn(response);

        OrderCancelRequestResponse result = orderService.requestOrderCancellation(
                OrderCancelRequestRequest.builder().reason("  Wrong address  ").build(), 10L);

        assertEquals(response, result);
        verify(orderCancelRequestRepository)
                .save(argThat(cancelRequest -> cancelRequest.getStatus() == CancelRequestStatus.PENDING
                        && cancelRequest.getReason().equals("Wrong address")
                        && cancelRequest.getOrder() == order));
    }

    @Test
    void requestOrderCancellation_shouldRejectBlankReason() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L))
                .thenReturn(Optional.of(orderWithStatus(OrderStatus.CONFIRMED)));

        assertError(
                ErrorCode.ORDER_CANCEL_REASON_INVALID,
                () -> orderService.requestOrderCancellation(
                        OrderCancelRequestRequest.builder().reason("   ").build(), 10L));
        verify(orderCancelRequestRepository, never()).save(any());
    }

    @Test
    void requestOrderCancellation_shouldRejectPendingOrder() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L))
                .thenReturn(Optional.of(orderWithStatus(OrderStatus.PENDING)));

        assertError(
                ErrorCode.ORDER_CANCEL_REQUEST_NOT_ALLOWED,
                () -> orderService.requestOrderCancellation(
                        OrderCancelRequestRequest.builder().reason("reason").build(), 10L));
    }

    @Test
    void requestOrderCancellation_shouldRejectDuplicateRequest() {
        User user = User.builder().id(1L).build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(orderRepository.findByIdAndUserIdForUpdate(10L, 1L))
                .thenReturn(Optional.of(orderWithStatus(OrderStatus.SHIPPING)));
        when(orderCancelRequestRepository.existsByOrderId(10L)).thenReturn(true);

        assertError(
                ErrorCode.ORDER_CANCEL_REQUEST_EXISTED,
                () -> orderService.requestOrderCancellation(
                        OrderCancelRequestRequest.builder().reason("reason").build(), 10L));
    }

    @Test
    void approveCancelOrder_shouldRestoreStockReverseCouponAndCancelOrder() {
        User admin = User.builder().id(1L).build();
        Order order = orderWithStatus(OrderStatus.PROCESSING);
        OrderCancelRequest cancelRequest = new OrderCancelRequest();
        cancelRequest.setOrder(order);
        OrderCancelRequestResponse response =
                OrderCancelRequestResponse.builder().id(20L).build();
        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(orderCancelRequestRepository.findPendingCancelRequestById(20L)).thenReturn(Optional.of(cancelRequest));
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(order));
        when(orderCancelRequestRepository.save(cancelRequest)).thenReturn(cancelRequest);
        when(orderMapper.toOrderCancelRequestResponse(cancelRequest)).thenReturn(response);

        assertEquals(response, orderService.approveCancelOrder(20L));
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        assertEquals(CancelRequestStatus.APPROVED, cancelRequest.getStatus());
        assertEquals(admin, cancelRequest.getReviewedBy());
        verify(couponApplicationService).reverseUsage(order);
        verify(inventoryService).restoreForOrder(order, admin);
        verify(orderPaymentService).markCancelled(order);
    }

    @Test
    void approveCancelOrder_shouldRejectCompletedOrder() {
        OrderCancelRequest cancelRequest = new OrderCancelRequest();
        cancelRequest.setOrder(orderWithStatus(OrderStatus.COMPLETED));
        when(currentUserService.getCurrentUser())
                .thenReturn(User.builder().id(1L).build());
        when(orderCancelRequestRepository.findPendingCancelRequestById(20L)).thenReturn(Optional.of(cancelRequest));
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(cancelRequest.getOrder()));

        assertError(ErrorCode.ORDER_CANCEL_REQUEST_NOT_ALLOWED, () -> orderService.approveCancelOrder(20L));
        verifyNoInteractions(inventoryService, couponApplicationService, orderPaymentService);
    }

    @Test
    void approveCancelOrder_shouldRejectMissingPendingRequest() {
        when(currentUserService.getCurrentUser())
                .thenReturn(User.builder().id(1L).build());
        when(orderCancelRequestRepository.findPendingCancelRequestById(20L)).thenReturn(Optional.empty());

        assertError(ErrorCode.ORDER_CANCEL_REQUEST_NOT_FOUND, () -> orderService.approveCancelOrder(20L));
    }

    @Test
    void rejectCancelOrder_shouldMarkRequestRejected() {
        User admin = User.builder().id(1L).build();
        OrderCancelRequest cancelRequest = new OrderCancelRequest();
        OrderCancelRequestResponse response =
                OrderCancelRequestResponse.builder().id(20L).build();
        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(orderCancelRequestRepository.findPendingCancelRequestById(20L)).thenReturn(Optional.of(cancelRequest));
        when(orderCancelRequestRepository.save(cancelRequest)).thenReturn(cancelRequest);
        when(orderMapper.toOrderCancelRequestResponse(cancelRequest)).thenReturn(response);

        assertEquals(response, orderService.rejectCancelOrder(20L));
        assertEquals(CancelRequestStatus.REJECTED, cancelRequest.getStatus());
        assertEquals(admin, cancelRequest.getReviewedBy());
        assertNotNull(cancelRequest.getReviewedAt());
    }

    private void assertAdminTransition(
            OrderStatus oldStatus,
            OrderStatus newStatus,
            ShippingStatus shippingStatus,
            java.util.function.Supplier<OrderResponse> action,
            String note) {
        User admin = User.builder().id(1L).build();
        Order order = orderWithStatus(oldStatus);
        OrderResponse response = OrderResponse.builder().id(10L).build();
        when(orderRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(order));
        when(currentUserService.getCurrentUser()).thenReturn(admin);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toOrderResponse(order)).thenReturn(response);

        assertEquals(response, action.get());
        assertEquals(newStatus, order.getStatus());
        assertEquals(shippingStatus, order.getShippingStatus());
        verify(orderStatusHistoryService).record(order, admin, oldStatus, newStatus, note);
    }

    private Order orderWithStatus(OrderStatus status) {
        Order order = new Order();
        order.setId(10L);
        order.setStatus(status);
        return order;
    }

    private void assertError(ErrorCode errorCode, org.junit.jupiter.api.function.Executable action) {
        AppException exception = assertThrows(AppException.class, action);
        assertEquals(errorCode, exception.getErrorCode());
    }
}
