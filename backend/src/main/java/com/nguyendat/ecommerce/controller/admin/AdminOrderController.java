package com.nguyendat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.PageRequest;
import com.nguyendat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.nguyendat.ecommerce.dto.response.OrderResponse;
import com.nguyendat.ecommerce.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.ORDER_ACCESS)
public class AdminOrderController {

    OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDERS_FETCHED, orderService.getOrdersInPage(pageRequest.toPageable())));
    }

    @GetMapping("/orders/all")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.ORDERS_FETCHED, orderService.getAllOrders()));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_FETCHED, orderService.getOrderById(orderId)));
    }

    @PostMapping("/orders/{orderId}/confirmations")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_STATUS_UPDATED, orderService.confirmOrder(orderId)));
    }

    @PostMapping("/orders/{orderId}/processing-events")
    public ResponseEntity<ApiResponse<OrderResponse>> processOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ORDER_STATUS_UPDATED, orderService.processOrder(orderId)));
    }

    @PostMapping("/orders/{orderId}/shipments")
    public ResponseEntity<ApiResponse<OrderResponse>> shipOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_SHIPPING_STATUS_UPDATED, orderService.shipOrder(orderId)));
    }

    @PostMapping("/orders/{orderId}/deliveries")
    public ResponseEntity<ApiResponse<OrderResponse>> deliverOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_SHIPPING_STATUS_UPDATED, orderService.deliverOrder(orderId)));
    }

    @GetMapping("/order-cancel-requests")
    public ResponseEntity<ApiResponse<PageResponse<OrderCancelRequestResponse>>> getOrderCancelRequestsPage(
            @Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.ORDER_CANCEL_REQUESTS_FETCHED,
                orderService.getOrderCancelRequestsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/order-cancel-requests/all")
    public ResponseEntity<ApiResponse<List<OrderCancelRequestResponse>>> getAllOrderCancelRequest() {
        return ResponseEntity.ok(ApiResponse.ofList(
                ResponseCode.ORDER_CANCEL_REQUESTS_FETCHED, orderService.getAllOrderCancelRequests()));
    }

    @PostMapping("/order-cancel-requests/{requestId}/approvals")
    public ResponseEntity<ApiResponse<OrderCancelRequestResponse>> approveCancelOrder(@PathVariable long requestId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_CANCEL_REQUEST_APPROVED, orderService.approveCancelOrder(requestId)));
    }

    @PostMapping("/order-cancel-requests/{requestId}/rejections")
    public ResponseEntity<ApiResponse<OrderCancelRequestResponse>> rejectCancelOrder(@PathVariable long requestId) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ORDER_CANCEL_REQUEST_REJECTED, orderService.rejectCancelOrder(requestId)));
    }
}

