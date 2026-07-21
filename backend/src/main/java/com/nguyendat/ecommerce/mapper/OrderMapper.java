package com.nguyendat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nguyendat.ecommerce.dto.response.OrderCancelRequestResponse;
import com.nguyendat.ecommerce.dto.response.OrderItemResponse;
import com.nguyendat.ecommerce.dto.response.OrderResponse;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderCancelRequest;
import com.nguyendat.ecommerce.entity.OrderItem;
import com.nguyendat.ecommerce.entity.ProductMedia;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "addressId", source = "address.id")
    @Mapping(target = "couponId", source = "coupon.id")
    @Mapping(target = "couponCode", source = "coupon.code")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userAvatarUrl", source = "user.avatarUrl")
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "productVariantId", source = "productVariant.id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "productSlug", source = "productVariant.product.slug")
    @Mapping(target = "thumbnailUrl", expression = "java(resolveThumbnailUrl(orderItem))")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "requestedBy", source = "requestedBy.id")
    @Mapping(target = "reviewedBy", source = "reviewedBy.id")
    OrderCancelRequestResponse toOrderCancelRequestResponse(OrderCancelRequest orderCancelRequest);

    default String resolveThumbnailUrl(OrderItem orderItem) {
        if (orderItem == null
                || orderItem.getProductVariant() == null
                || orderItem.getProductVariant().getProduct() == null
                || orderItem.getProductVariant().getProduct().getMedia() == null) {
            return null;
        }

        return orderItem.getProductVariant().getProduct().getMedia().stream()
                .filter(media -> media != null && media.isActive() && !media.isDeleted())
                .sorted((left, right) -> {
                    if (left.isThumbnail() != right.isThumbnail()) {
                        return left.isThumbnail() ? -1 : 1;
                    }
                    return Integer.compare(left.getSortOrder(), right.getSortOrder());
                })
                .map(ProductMedia::getUrl)
                .findFirst()
                .orElse(null);
    }
}

