package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminOrderController {

    OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.ORDERS_FETCHED, orderService.getAllOrders()));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_FETCHED, orderService.getOrderById(orderId)));
    }

    @PatchMapping("/orders/{orderId}/confirm")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_STATUS_UPDATED, orderService.confirmOrder(orderId)));
    }

    @PatchMapping("/orders/{orderId}/process")
    public ResponseEntity<ApiResponse<OrderResponse>> processOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_STATUS_UPDATED, orderService.processOrder(orderId)));
    }

    @PatchMapping("/orders/{orderId}/ship")
    public ResponseEntity<ApiResponse<OrderResponse>> shipOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_SHIPPING_STATUS_UPDATED, orderService.shipOrder(orderId)));
    }

    @PatchMapping("/orders/{orderId}/deliver")
    public ResponseEntity<ApiResponse<OrderResponse>> deliverOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_SHIPPING_STATUS_UPDATED, orderService.deliverOrder(orderId)));
    }

    @GetMapping("/order-cancel-requests")
    public ResponseEntity<ApiResponse<List<OrderCancelRequestResponse>>> getAllOrderCancelRequest() {
        return ResponseEntity.ok(ApiResponse.ofList(
                ResponseCode.ORDER_CANCEL_REQUESTS_FETCHED, orderService.getAllOrderCancelRequests()));
    }

    @PatchMapping("/order-cancel-requests/{requestId}/approve")
    public ResponseEntity<ApiResponse<OrderCancelRequestResponse>> approveCancelOrder(@PathVariable long requestId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_CANCEL_REQUEST_APPROVED, orderService.approveCancelOrder(requestId)));
    }

    @PatchMapping("/order-cancel-requests/{requestId}/reject")
    public ResponseEntity<ApiResponse<OrderCancelRequestResponse>> rejectCancelOrder(@PathVariable long requestId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_CANCEL_REQUEST_REJECTED, orderService.rejectCancelOrder(requestId)));
    }
}
