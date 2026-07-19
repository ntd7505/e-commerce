package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductSummaryResponse {
    Long id;
    String name;
    String slug;
    String thumbnailUrl;
    BigDecimal price;
    BigDecimal salePrice;
}
