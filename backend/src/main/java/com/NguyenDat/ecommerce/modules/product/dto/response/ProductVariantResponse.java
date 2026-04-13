package com.NguyenDat.ecommerce.modules.product.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantResponse {
    private Long id;
    String variantName;
    int stockQuantity = 0;
    double price;
    double salePrice;
    String currency;
    String sku;
}
