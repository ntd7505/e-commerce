package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.NguyenDat.ecommerce.dto.response.OrderItemResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.OrderCancelRequest;
import com.NguyenDat.ecommerce.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "addressId", source = "address.id")
    @Mapping(target = "couponId", source = "coupon.id")
    @Mapping(target = "couponCode", source = "coupon.code")
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "productVariantId", source = "productVariant.id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "requestedBy", source = "requestedBy.id")
    @Mapping(target = "reviewedBy", source = "reviewedBy.id")
    OrderCancelRequestResponse toOrderCancelRequestResponse(OrderCancelRequest orderCancelRequest);
}
