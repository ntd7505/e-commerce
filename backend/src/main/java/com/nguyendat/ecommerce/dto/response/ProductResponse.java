package com.nguyendat.ecommerce.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.nguyendat.ecommerce.dto.response.category.CategorySummaryResponse;

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
    String thumbnailUrl;
    Double rating;
    Integer soldCount;
    boolean active;
    List<ProductVariantResponse> variants;
    List<ProductMediaResponse> media;
    List<ProductDescriptionBlockResponse> descriptionBlocks;
    List<ProductSpecificationResponse> specifications;
    LocalDateTime createdAt;
}

