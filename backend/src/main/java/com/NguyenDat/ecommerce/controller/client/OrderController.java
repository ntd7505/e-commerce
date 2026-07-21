package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.dto.request.OrderCancelRequestRequest;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
import com.NguyenDat.ecommerce.dto.response.CheckoutPreviewResponse;
import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class OrderController {

    OrderService orderService;

    @PostMapping("/checkout/preview")
    public ResponseEntity<ApiResponse<CheckoutPreviewResponse>> previewOrder(
            @RequestBody @Valid CheckoutPreviewRequest checkoutPreviewRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.CHECKOUT_PREVIEW_CREATED, orderService.createCheckoutPreview(checkoutPreviewRequest)));
    }

    @PostMapping("/checkout/buy-now/preview")
    public ResponseEntity<ApiResponse<CheckoutPreviewResponse>> previewBuyNowOrder(
            @RequestBody @Valid com.NguyenDat.ecommerce.dto.request.BuyNowPreviewRequest request) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.CHECKOUT_PREVIEW_CREATED, orderService.createBuyNowCheckoutPreview(request)));
    }

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody @Valid CheckoutRequest checkoutRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.ORDER_CREATED, orderService.createOrder(checkoutRequest)));
    }

    @PostMapping("/orders/buy-now")
    public ResponseEntity<ApiResponse<OrderResponse>> createBuyNowOrder(@RequestBody @Valid com.NguyenDat.ecommerce.dto.request.BuyNowCheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.ORDER_CREATED, orderService.createBuyNowOrder(request)));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_FETCHED, orderService.getMyOrderById(orderId)));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrdersPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDERS_FETCHED, orderService.getMyOrdersInPage(pageRequest.toPageable())));
    }

    @GetMapping("/orders/all")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrder() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.ORDERS_FETCHED, orderService.getMyOrder()));
    }

    @PostMapping("/orders/{orderId}/cancellations")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelMyOrder(
            @RequestBody @Valid OrderCancelRequestRequest orderCancelRequestRequest, @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.ORDER_CANCELLED, orderService.cancelMyOrder(orderCancelRequestRequest, orderId)));
    }

    @PostMapping("/orders/{orderId}/receipts")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmReceived(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_STATUS_UPDATED, orderService.confirmReceived(orderId)));
    }

    @PostMapping("/orders/{orderId}/cancellation-requests")
    public ResponseEntity<ApiResponse<OrderCancelRequestResponse>> requestOrderCancellation(
            @RequestBody @Valid OrderCancelRequestRequest orderCancelRequestRequest, @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.ORDER_CANCEL_REQUEST_CREATED,
                orderService.requestOrderCancellation(orderCancelRequestRequest, orderId)));
    }
}
