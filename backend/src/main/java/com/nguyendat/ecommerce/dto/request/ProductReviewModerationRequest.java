package com.nguyendat.ecommerce.dto.request;

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
public class ProductReviewModerationRequest {

    @NotNull(message = "Review active status is required")
    Boolean active;

    @Size(max = 500, message = "Review moderation note must not exceed 500 characters")
    String note;
}

