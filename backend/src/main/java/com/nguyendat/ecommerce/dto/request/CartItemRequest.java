package com.nguyendat.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {

    @NotNull(message = "CART_PRODUCT_VARIANT_REQUIRED")
    Long productVariantId;

    @NotNull(message = "CART_ITEM_QUANTITY_REQUIRED")
    @Min(value = 1, message = "CART_ITEM_QUANTITY_INVALID")
    Integer quantity;
}

