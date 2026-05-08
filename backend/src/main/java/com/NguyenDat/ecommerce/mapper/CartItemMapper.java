package com.NguyenDat.ecommerce.mapper;

import java.math.BigDecimal;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.response.CartItemResponse;
import com.NguyenDat.ecommerce.entity.CartItem;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "productName", source = "productVariant.product.name")
    @Mapping(target = "productVariantId", source = "productVariant.id")
    @Mapping(target = "variantName", source = "productVariant.variantName")
    @Mapping(target = "sku", source = "productVariant.sku")
    @Mapping(target = "lineTotal", expression = "java(calculateLineTotal(cartItem))")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    default BigDecimal calculateLineTotal(CartItem cartItem) {
        if (cartItem.getUnitPrice() == null || cartItem.getQuantity() == null) {
            return BigDecimal.ZERO;
        }
        return cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
    }
}
