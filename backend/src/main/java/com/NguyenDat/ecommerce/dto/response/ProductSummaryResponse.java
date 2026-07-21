package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

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
    List<String> imageUrls;
    BigDecimal price;
    BigDecimal salePrice;
}
