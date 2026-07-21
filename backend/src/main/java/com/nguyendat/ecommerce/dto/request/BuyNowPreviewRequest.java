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
public class BuyNowPreviewRequest {
    @NotNull(message = "PRODUCT_VARIANT_REQUIRED")
    Long productVariantId;

    @NotNull(message = "QUANTITY_REQUIRED")
    @Min(value = 1, message = "QUANTITY_INVALID")
    Integer quantity;

    String couponCode;

    Long addressId;
}

