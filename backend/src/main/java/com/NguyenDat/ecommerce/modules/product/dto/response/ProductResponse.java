package com.NguyenDat.ecommerce.modules.product.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;

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
    BrandResponse brand;
    CategoryResponse category;
    boolean active;
    List<ProductVariantResponse> variants;
    List<ProductMediaResponse> media;
    LocalDateTime createdAt;
}
