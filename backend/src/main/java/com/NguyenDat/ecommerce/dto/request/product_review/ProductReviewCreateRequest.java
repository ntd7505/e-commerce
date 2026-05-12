package com.NguyenDat.ecommerce.dto.request.product_review;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewCreateRequest {

    @NotNull(message = "FIELD_REQUIRED")
    Long orderItemId;

    @NotNull(message = "FIELD_REQUIRED")
    @Min(value = 1, message = "REVIEW_RATING_INVALID")
    @Max(value = 5, message = "REVIEW_RATING_INVALID")
    Integer rating;

    @Size(max = 150, message = "REVIEW_TITLE_INVALID")
    String title;

    @Size(max = 2000, message = "REVIEW_CONTENT_INVALID")
    String content;

    Boolean anonymous;

    @Valid
    @Size(max = 5, message = "REVIEW_MEDIA_LIMIT_EXCEEDED")
    List<ProductReviewMediaRequest> media;
}
