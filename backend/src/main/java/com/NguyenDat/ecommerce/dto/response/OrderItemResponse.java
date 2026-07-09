package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    Long id;

    Long productId;
    Long productVariantId;
    String productSlug;

    String productName;
    String thumbnailUrl;
    String variantName;
    String sku;

    Integer quantity;

    BigDecimal unitPrice;
    BigDecimal lineTotal;
}
