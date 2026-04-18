package com.NguyenDat.ecommerce.modules.product.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 150)
    String variantName;

    @Min(value = 0, message = "STOCK_MUST_BE_POSITIVE")
    int stockQuantity = 0;

    @Positive(message = "PRICE_MUST_BE_POSITIVE")
    double price;

    @PositiveOrZero(message = "SALE_PRICE_MUST_BE_NON_NEGATIVE")
    double salePrice;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 3)
    String currency;
}
