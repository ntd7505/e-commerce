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
public class ProductReviewResponse {
    Long id;

    Long productId;
    Long orderItemId;

    Integer rating;
    String title;
    String content;
    Boolean anonymous;

    ReviewUserResponse user;

    String productName;
    String variantName;
    String sku;

    List<ProductReviewMediaResponse> media;

    Boolean active;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
