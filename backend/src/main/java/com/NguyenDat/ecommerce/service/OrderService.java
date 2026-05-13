package com.NguyenDat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;

public interface OrderService {

    CheckoutPreviewResponse createCheckoutPreview(@Valid CheckoutPreviewRequest checkoutPreviewRequest);

    OrderResponse createOrder(@Valid CheckoutRequest checkoutRequest);

    OrderResponse getMyOrderById(Long orderId);

    List<OrderResponse> getMyOrder();

    OrderResponse cancelMyOrder(OrderCancelRequestRequest orderCancelRequestRequest, Long orderId);
}
