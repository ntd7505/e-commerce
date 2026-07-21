package com.nguyendat.ecommerce.service.impl;

import static com.nguyendat.ecommerce.enums.OrderStatus.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.nguyendat.ecommerce.dto.response.CheckoutItemResponse;
import com.nguyendat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.nguyendat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.nguyendat.ecommerce.dto.response.OrderResponse;
import com.nguyendat.ecommerce.entity.*;
import com.nguyendat.ecommerce.enums.*;
import com.nguyendat.ecommerce.mapper.AddressMapper;
import com.nguyendat.ecommerce.mapper.CheckoutItemMapper;
import com.nguyendat.ecommerce.mapper.OrderMapper;
import com.nguyendat.ecommerce.repository.*;
import com.nguyendat.ecommerce.service.CheckoutService;
import com.nguyendat.ecommerce.service.CouponApplicationService;
import com.nguyendat.ecommerce.service.CurrentUserService;
import com.nguyendat.ecommerce.service.InventoryService;
import com.nguyendat.ecommerce.service.OrderCreationService;
import com.nguyendat.ecommerce.service.OrderPaymentService;
import com.nguyendat.ecommerce.service.OrderService;
import com.nguyendat.ecommerce.service.OrderStatusHistoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {
    java.time.Clock clock;

    CheckoutItemMapper checkoutItemMapper;
    AddressMapper addressMapper;
    OrderMapper orderMapper;
    OrderRepository orderRepository;
    OrderCancelRequestRepository orderCancelRequestRepository;
    CouponApplicationService couponApplicationService;
    CheckoutService checkoutService;
    CurrentUserService currentUserService;
    InventoryService inventoryService;
    OrderPaymentService orderPaymentService;
    OrderCreationService orderCreationService;
    OrderStatusHistoryService orderStatusHistoryService;

    public CheckoutPreviewResponse createCheckoutPreview(CheckoutPreviewRequest checkoutPreviewRequest) {
        User user = currentUserService.getCurrentUser();
        CheckoutCalculation checkoutCalculation = checkoutService.calculateForPreview(user, checkoutPreviewRequest);
        return buildCheckoutPreviewResponse(checkoutCalculation);
    }

    public CheckoutPreviewResponse createBuyNowCheckoutPreview(
            com.nguyendat.ecommerce.dto.request.BuyNowPreviewRequest request) {
        User user = currentUserService.getCurrentUser();
        CheckoutCalculation checkoutCalculation = checkoutService.calculateBuyNowForPreview(user, request);
        return buildCheckoutPreviewResponse(checkoutCalculation);
    }

    private CheckoutPreviewResponse buildCheckoutPreviewResponse(CheckoutCalculation checkoutCalculation) {
        List<CheckoutItemResponse> checkoutItemResponses = checkoutCalculation.getItems().stream()
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
                .paymentMethods(List.of(PaymentMethod.COD, PaymentMethod.BANK_TRANSFER))
                .selectedCouponCode(
                        checkoutCalculation.getCoupon() == null
                                ? null
                                : checkoutCalculation.getCoupon().getCode())
                .build();
    }

    @Transactional
    public OrderResponse createOrder(CheckoutRequest checkoutRequest) {
        if (checkoutRequest.getPaymentMethod() != PaymentMethod.COD
                && checkoutRequest.getPaymentMethod() != PaymentMethod.BANK_TRANSFER) {
            throw new AppException(ErrorCode.PAYMENT_METHOD_UNSUPPORTED);
        }
        User user = currentUserService.getCurrentUser();
        CheckoutCalculation checkoutCalculation = checkoutService.calculateForOrder(user, checkoutRequest);
        Order order = orderCreationService.create(user, checkoutRequest, checkoutCalculation);
        inventoryService.decreaseForOrder(order, user);
        return enrichPayment(orderMapper.toOrderResponse(order));
    }

    @Transactional
    public OrderResponse createBuyNowOrder(com.nguyendat.ecommerce.dto.request.BuyNowCheckoutRequest request) {
        if (request.getPaymentMethod() != PaymentMethod.COD
                && request.getPaymentMethod() != PaymentMethod.BANK_TRANSFER) {
            throw new AppException(ErrorCode.PAYMENT_METHOD_UNSUPPORTED);
        }
        User user = currentUserService.getCurrentUser();
        CheckoutCalculation checkoutCalculation = checkoutService.calculateBuyNowForOrder(user, request);

        // We need to map BuyNowCheckoutRequest to CheckoutRequest internally to re-use OrderCreationService.create
        // signature,
        // or just update OrderCreationService.create to take note and payment method directly.
        // Actually, OrderCreationService only uses getPaymentMethod() and getNote() from CheckoutRequest.
        // So we can map it here.
        CheckoutRequest checkoutRequest = new CheckoutRequest();
        checkoutRequest.setNote(request.getNote());
        checkoutRequest.setPaymentMethod(request.getPaymentMethod());
        checkoutRequest.setAddressId(request.getAddressId());
        checkoutRequest.setCouponCode(request.getCouponCode());

        Order order = orderCreationService.create(user, checkoutRequest, checkoutCalculation);
        inventoryService.decreaseForOrder(order, user);
        return enrichPayment(orderMapper.toOrderResponse(order));
    }

    @Override
    public OrderResponse getMyOrderById(Long orderId) {
        User user = currentUserService.getCurrentUser();

        Order order = orderRepository
                .findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return enrichPayment(orderMapper.toOrderResponse(order));
    }

    @Override
    public List<OrderResponse> getMyOrder() {
        User user = currentUserService.getCurrentUser();
        return orderRepository.findAllByUserId(user.getId()).stream()
                .map(orderMapper::toOrderResponse)
                .map(this::enrichPayment)
                .toList();
    }

    @Override
    public PageResponse<OrderResponse> getMyOrdersInPage(Pageable pageable) {
        User user = currentUserService.getCurrentUser();
        Page<Order> page = orderRepository.findAllByUserId(user.getId(), pageable);
        return PageResponse.from(page.map(orderMapper::toOrderResponse).map(this::enrichPayment));
    }

    @Override
    @Transactional
    public OrderResponse cancelMyOrder(OrderCancelRequestRequest orderCancelRequestRequest, Long orderId) {
        User user = currentUserService.getCurrentUser();
        Order order = orderRepository
                .findByIdAndUserIdForUpdate(orderId, user.getId())
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

        couponApplicationService.reverseUsage(order);
        inventoryService.restoreForOrder(order, user);

        OrderStatus oldStatus = order.getStatus();

        order.setStatus(OrderStatus.CANCELLED);
        order.setShippingStatus(ShippingStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now(clock));
        orderPaymentService.markCancelled(order);

        orderStatusHistoryService.record(order, user, oldStatus, OrderStatus.CANCELLED, "User cancelled pending order");

        Order savedOrder = orderRepository.save(order);

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setOrder(savedOrder);
        orderCancelRequest.setRequestedBy(user);
        orderCancelRequest.setReason(normalizedReason);
        orderCancelRequest.setStatus(CancelRequestStatus.APPROVED);
        orderCancelRequest.setRequestedAt(LocalDateTime.now(clock));
        orderCancelRequest.setReviewedAt(LocalDateTime.now(clock));
        orderCancelRequest.setReviewedBy(user);

        orderCancelRequestRepository.save(orderCancelRequest);

        return enrichPayment(orderMapper.toOrderResponse(savedOrder));
    }

    @Transactional
    public OrderResponse confirmReceived(Long orderId) {
        User user = currentUserService.getCurrentUser();
        Order order = orderRepository
                .findDeliveredOrderForUpdate(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderStatus oldStatus = order.getStatus();

        order.setStatus(OrderStatus.COMPLETED);
        order.setPaymentStatus(PaymentStatus.PAID);
        orderPaymentService.markPaid(order);

        orderStatusHistoryService.record(
                order, user, oldStatus, OrderStatus.COMPLETED, "User confirmed received order");

        return enrichPayment(orderMapper.toOrderResponse(orderRepository.save(order)));
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toOrderResponse)
                .map(this::enrichPayment)
                .toList();
    }

    @Override
    public PageResponse<OrderResponse> getOrdersInPage(Pageable pageable) {
        Page<Order> page = orderRepository.findAll(pageable);
        return PageResponse.from(page.map(orderMapper::toOrderResponse).map(this::enrichPayment));
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return enrichPayment(orderMapper.toOrderResponse(order));
    }

    @Transactional
    public OrderResponse confirmOrder(Long orderId) {
        User admin = currentUserService.getCurrentUser();
        Order order = orderRepository
                .findByIdForUpdate(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_INVALID);
        }

        OrderStatus oldStatus = order.getStatus();

        order.setStatus(CONFIRMED);
        order.setShippingStatus(ShippingStatus.PREPARING);

        orderStatusHistoryService.record(order, admin, oldStatus, CONFIRMED, "Admin confirmed order");

        return enrichPayment(orderMapper.toOrderResponse(orderRepository.save(order)));
    }

    @Transactional
    public OrderResponse processOrder(Long orderId) {
        Order order = orderRepository
                .findByIdForUpdate(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != CONFIRMED) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_INVALID);
        }

        User admin = currentUserService.getCurrentUser();
        OrderStatus oldStatus = order.getStatus();

        order.setStatus(PROCESSING);
        order.setShippingStatus(ShippingStatus.PREPARING);

        orderStatusHistoryService.record(order, admin, oldStatus, PROCESSING, "Admin processed order");

        return enrichPayment(orderMapper.toOrderResponse(orderRepository.save(order)));
    }

    @Transactional
    public OrderResponse shipOrder(Long orderId) {
        Order order = orderRepository
                .findByIdForUpdate(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != PROCESSING) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_INVALID);
        }

        User admin = currentUserService.getCurrentUser();
        OrderStatus oldStatus = order.getStatus();

        order.setStatus(SHIPPING);
        order.setShippingStatus(ShippingStatus.SHIPPING);

        orderStatusHistoryService.record(order, admin, oldStatus, SHIPPING, "Admin shipped order");

        return enrichPayment(orderMapper.toOrderResponse(orderRepository.save(order)));
    }

    @Transactional
    public OrderResponse deliverOrder(Long orderId) {
        Order order = orderRepository
                .findByIdForUpdate(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != SHIPPING) {
            throw new AppException(ErrorCode.ORDER_STATUS_TRANSITION_INVALID);
        }

        User admin = currentUserService.getCurrentUser();
        OrderStatus oldStatus = order.getStatus();

        order.setStatus(OrderStatus.DELIVERED);
        order.setShippingStatus(ShippingStatus.DELIVERED);

        orderStatusHistoryService.record(order, admin, oldStatus, OrderStatus.DELIVERED, "Admin delivered order");

        return enrichPayment(orderMapper.toOrderResponse(orderRepository.save(order)));
    }

    @Override
    @Transactional
    public OrderCancelRequestResponse requestOrderCancellation(
            OrderCancelRequestRequest orderCancelRequestRequest, Long orderId) {
        User user = currentUserService.getCurrentUser();
        Order order = orderRepository
                .findByIdAndUserIdForUpdate(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != CONFIRMED && order.getStatus() != PROCESSING && order.getStatus() != SHIPPING) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REQUEST_NOT_ALLOWED);
        }

        if (orderCancelRequestRepository.existsByOrderId(orderId)) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REQUEST_EXISTED);
        }

        String normalizedReason = orderCancelRequestRequest.getReason().trim();
        if (normalizedReason.isBlank()) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REASON_INVALID);
        }

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setStatus(CancelRequestStatus.PENDING);
        orderCancelRequest.setReason(normalizedReason);
        orderCancelRequest.setRequestedAt(LocalDateTime.now(clock));
        orderCancelRequest.setOrder(order);
        orderCancelRequest.setRequestedBy(user);
        return orderMapper.toOrderCancelRequestResponse(orderCancelRequestRepository.save(orderCancelRequest));
    }

    @Override
    public List<OrderCancelRequestResponse> getAllOrderCancelRequests() {
        return orderCancelRequestRepository.findAll().stream()
                .map(orderMapper::toOrderCancelRequestResponse)
                .toList();
    }

    @Override
    public PageResponse<OrderCancelRequestResponse> getOrderCancelRequestsInPage(Pageable pageable) {
        Page<OrderCancelRequest> page = orderCancelRequestRepository.findAll(pageable);
        return PageResponse.from(page.map(orderMapper::toOrderCancelRequestResponse));
    }

    @Transactional
    public OrderCancelRequestResponse approveCancelOrder(long requestId) {
        User user = currentUserService.getCurrentUser();
        OrderCancelRequest orderCancelRequest = orderCancelRequestRepository
                .findPendingCancelRequestById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_CANCEL_REQUEST_NOT_FOUND));

        Order order = orderRepository
                .findByIdForUpdate(orderCancelRequest.getOrder().getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != CONFIRMED && order.getStatus() != PROCESSING && order.getStatus() != SHIPPING) {
            throw new AppException(ErrorCode.ORDER_CANCEL_REQUEST_NOT_ALLOWED);
        }

        couponApplicationService.reverseUsage(order);

        OrderStatus oldStatus = order.getStatus();

        inventoryService.restoreForOrder(order, user);

        order.setStatus(OrderStatus.CANCELLED);
        order.setShippingStatus(ShippingStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now(clock));
        orderPaymentService.markCancelled(order);

        orderStatusHistoryService.record(
                order, user, oldStatus, OrderStatus.CANCELLED, "Admin approved cancellation request");

        orderRepository.save(order);

        orderCancelRequest.setStatus(CancelRequestStatus.APPROVED);
        orderCancelRequest.setReviewedAt(LocalDateTime.now(clock));
        orderCancelRequest.setReviewedBy(user);

        return orderMapper.toOrderCancelRequestResponse(orderCancelRequestRepository.save(orderCancelRequest));
    }

    @Transactional
    public OrderCancelRequestResponse rejectCancelOrder(long requestId) {
        User user = currentUserService.getCurrentUser();
        OrderCancelRequest orderCancelRequest = orderCancelRequestRepository
                .findPendingCancelRequestById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_CANCEL_REQUEST_NOT_FOUND));
        orderCancelRequest.setStatus(CancelRequestStatus.REJECTED);
        orderCancelRequest.setReviewedAt(LocalDateTime.now(clock));
        orderCancelRequest.setReviewedBy(user);
        return orderMapper.toOrderCancelRequestResponse(orderCancelRequestRepository.save(orderCancelRequest));
    }

    private OrderResponse enrichPayment(OrderResponse response) {
        if (response != null && response.getPayment() != null) {
            orderPaymentService.enrichPaymentResponse(response.getPayment());
            response.getPayment().setOrderId(response.getId());
        }
        return response;
    }
}

