package com.NguyenDat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;

public interface OrderService {

    CheckoutPreviewResponse createCheckoutPreview(@Valid CheckoutPreviewRequest checkoutPreviewRequest);

    OrderResponse createOrder(@Valid CheckoutRequest checkoutRequest);

    OrderResponse getMyOrderById(Long orderId);

    List<OrderResponse> getMyOrder();

    PageResponse<OrderResponse> getMyOrdersInPage(Pageable pageable);

    OrderResponse cancelMyOrder(OrderCancelRequestRequest orderCancelRequestRequest, Long orderId);

    OrderResponse confirmReceived(Long orderId);

    List<OrderResponse> getAllOrders();

    PageResponse<OrderResponse> getOrdersInPage(Pageable pageable);

    OrderResponse getOrderById(Long orderId);

    OrderResponse confirmOrder(Long orderId);

    OrderResponse processOrder(Long orderId);

    OrderResponse shipOrder(Long orderId);

    OrderResponse deliverOrder(Long orderId);

    OrderCancelRequestResponse requestOrderCancellation(
            @Valid OrderCancelRequestRequest orderCancelRequestRequest, Long orderId);

    List<OrderCancelRequestResponse> getAllOrderCancelRequests();

    PageResponse<OrderCancelRequestResponse> getOrderCancelRequestsInPage(Pageable pageable);

    OrderCancelRequestResponse approveCancelOrder(long requestId);

    OrderCancelRequestResponse rejectCancelOrder(long requestId);
}
