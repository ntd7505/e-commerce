package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.NguyenDat.ecommerce.enums.ReviewMediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewMediaRequest {
    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 500, message = "REVIEW_MEDIA_URL_INVALID")
    String url;

    @NotNull(message = "FIELD_REQUIRED")
    ReviewMediaType mediaType;

    @Min(value = 0, message = "REVIEW_MEDIA_SORT_ORDER_INVALID")
    Integer sortOrder;
}
