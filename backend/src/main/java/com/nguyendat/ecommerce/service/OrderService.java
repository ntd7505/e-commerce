package com.nguyendat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.nguyendat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.nguyendat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.nguyendat.ecommerce.dto.response.OrderResponse;

public interface OrderService {

    CheckoutPreviewResponse createCheckoutPreview(@Valid CheckoutPreviewRequest checkoutPreviewRequest);

    OrderResponse createOrder(@Valid CheckoutRequest checkoutRequest);

    CheckoutPreviewResponse createBuyNowCheckoutPreview(
            @Valid com.nguyendat.ecommerce.dto.request.BuyNowPreviewRequest buyNowPreviewRequest);

    OrderResponse createBuyNowOrder(
            @Valid com.nguyendat.ecommerce.dto.request.BuyNowCheckoutRequest buyNowCheckoutRequest);

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

