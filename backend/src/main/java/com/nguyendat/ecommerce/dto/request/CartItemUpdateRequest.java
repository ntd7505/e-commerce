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
public class CartItemUpdateRequest {

    @NotNull(message = "CART_ITEM_QUANTITY_REQUIRED")
    @Min(value = 1, message = "CART_ITEM_QUANTITY_INVALID")
    Integer quantity;
}

