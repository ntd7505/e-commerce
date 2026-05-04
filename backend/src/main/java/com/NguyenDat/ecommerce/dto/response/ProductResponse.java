package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;
import java.util.List;

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
