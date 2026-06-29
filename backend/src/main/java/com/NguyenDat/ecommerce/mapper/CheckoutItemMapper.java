package com.NguyenDat.ecommerce.mapper;

import java.math.BigDecimal;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.response.CheckoutItemResponse;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.ProductMedia;

@Mapper(componentModel = "spring")
public interface CheckoutItemMapper {

    @Mapping(target = "cartItemId", source = "id")
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "thumbnailUrl", expression = "java(resolveThumbnailUrl(cartItem))")
    @Mapping(target = "productVariantId", source = "productVariant.id")
    @Mapping(target = "variantName", source = "productVariant.variantName")
    @Mapping(target = "sku", source = "productVariant.sku")
    @Mapping(target = "quantity", source = "cartItem.quantity")
    @Mapping(target = "unitPrice", source = "cartItem.unitPrice")
    @Mapping(target = "originalPrice", source = "productVariant.price")
    @Mapping(target = "lineTotal", expression = "java(calculateLineTotal(cartItem))")
    CheckoutItemResponse toCheckoutItemResponse(CartItem cartItem);

    default BigDecimal calculateLineTotal(CartItem cartItem) {
        if (cartItem.getUnitPrice() == null || cartItem.getQuantity() == null) {
            return BigDecimal.ZERO;
        }
        return cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
    }

    default String resolveThumbnailUrl(CartItem cartItem) {
        if (cartItem == null
                || cartItem.getProductVariant() == null
                || cartItem.getProductVariant().getProduct() == null
                || cartItem.getProductVariant().getProduct().getMedia() == null) {
            return null;
        }

        return cartItem.getProductVariant().getProduct().getMedia().stream()
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
