package com.NguyenDat.ecommerce.modules.product.dto.request;

import jakarta.validation.constraints.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantUpdateRequest {

    @Size(max = 150)
    String variantName;

    @Min(value = 0, message = "STOCK_MUST_BE_POSITIVE")
    Integer stockQuantity;

    @Positive(message = "PRICE_MUST_BE_POSITIVE")
    Double price;

    @PositiveOrZero(message = "SALE_PRICE_MUST_BE_NON_NEGATIVE")
    Double salePrice;

    @Size(max = 3)
    String currency;

    Boolean active;
}
