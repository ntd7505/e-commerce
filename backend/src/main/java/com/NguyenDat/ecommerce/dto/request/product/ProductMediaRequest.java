package com.NguyenDat.ecommerce.dto.request.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMediaRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 500)
    String url;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 50)
    String mediaType;

    boolean thumbnail;

    @Min(value = 0)
    int sortOrder;

    @Size(max = 255)
    String altText;
}
