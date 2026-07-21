package com.nguyendat.ecommerce.mapper;

import java.math.BigDecimal;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nguyendat.ecommerce.dto.internal.CheckoutItem;
import com.nguyendat.ecommerce.dto.response.CheckoutItemResponse;
import com.nguyendat.ecommerce.entity.ProductMedia;

@Mapper(componentModel = "spring")
public interface CheckoutItemMapper {

    @Mapping(target = "cartItemId", source = "cartItemId")
    @Mapping(target = "productId", source = "variant.product.id")
    @Mapping(target = "productName", source = "variant.product.name")
    @Mapping(target = "thumbnailUrl", expression = "java(resolveThumbnailUrl(checkoutItem))")
    @Mapping(target = "productVariantId", source = "variant.id")
    @Mapping(target = "variantName", source = "variant.variantName")
    @Mapping(target = "sku", source = "variant.sku")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitPrice", source = "unitPrice")
    @Mapping(target = "originalPrice", source = "variant.price")
    @Mapping(target = "lineTotal", expression = "java(calculateLineTotal(checkoutItem))")
    CheckoutItemResponse toCheckoutItemResponse(CheckoutItem checkoutItem);

    default BigDecimal calculateLineTotal(CheckoutItem checkoutItem) {
        if (checkoutItem.getUnitPrice() == null || checkoutItem.getQuantity() == null) {
            return BigDecimal.ZERO;
        }
        return checkoutItem.getUnitPrice().multiply(BigDecimal.valueOf(checkoutItem.getQuantity()));
    }

    default String resolveThumbnailUrl(CheckoutItem checkoutItem) {
        if (checkoutItem == null
                || checkoutItem.getVariant() == null
                || checkoutItem.getVariant().getProduct() == null
                || checkoutItem.getVariant().getProduct().getMedia() == null) {
            return null;
        }

        return checkoutItem.getVariant().getProduct().getMedia().stream()
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

