package com.NguyenDat.ecommerce.dto.response;

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

    @Builder.Default
    int stockQuantity = 0;

    double price;
    double salePrice;
    String currency;
    String sku;
    boolean active;
}
