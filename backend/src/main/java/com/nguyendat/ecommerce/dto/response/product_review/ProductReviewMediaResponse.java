package com.nguyendat.ecommerce.dto.response.product_review;

import com.nguyendat.ecommerce.enums.ReviewMediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewMediaResponse {
    Long id;
    String url;
    ReviewMediaType mediaType;
    Integer sortOrder;
}

