package com.NguyenDat.ecommerce.modules.product.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.NguyenDat.ecommerce.modules.category.dto.CategorySummaryResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String name;
    String slug;
    String shortDescription;
    String description;
    BrandSummaryResponse brand;
    CategorySummaryResponse category;
    boolean active;
    List<ProductVariantResponse> variants;
    List<ProductMediaResponse> media;
    LocalDateTime createdAt;
}
