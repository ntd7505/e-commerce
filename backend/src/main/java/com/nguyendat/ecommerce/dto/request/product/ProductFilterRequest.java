package com.nguyendat.ecommerce.dto.request.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.PositiveOrZero;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFilterRequest {
    String keyword;
    Long brandId;
    Long categoryId;
    Boolean active;

    @PositiveOrZero
    BigDecimal minPrice;

    @PositiveOrZero
    BigDecimal maxPrice;
}

