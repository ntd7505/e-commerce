package com.nguyendat.ecommerce.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutItemResponse {
    Long cartItemId;

    Long productId;
    String productName;
    String thumbnailUrl;

    Long productVariantId;
    String variantName;
    String sku;

    Integer quantity;
    BigDecimal unitPrice;
    BigDecimal originalPrice;
    BigDecimal lineTotal;
}

