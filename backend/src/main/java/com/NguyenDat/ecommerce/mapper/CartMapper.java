package com.NguyenDat.ecommerce.mapper;

import com.NguyenDat.ecommerce.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.response.CartResponse;
import com.NguyenDat.ecommerce.entity.Cart;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", uses = CartItemMapper.class)
public interface CartMapper {

    @Mapping(target = "totalItems", expression = "java(calculateTotalItems(cart))")
    @Mapping(target = "subtotalAmount", expression = "java(calculateSubtotalAmount(cart))")
    CartResponse toCartResponse(Cart cart);

    default Integer calculateTotalItems(Cart cart) {
        if (cart.getItems() == null) {
            return 0;
        }

        return cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    default BigDecimal calculateSubtotalAmount(Cart cart) {
        if (cart.getItems() == null) {
            return BigDecimal.ZERO;
        }

        return cart.getItems().stream()
                .map(item -> item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
