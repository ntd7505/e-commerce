package com.NguyenDat.ecommerce.modules.product.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
public class ProductRequest {
    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 200)
    String name;

    @Size(max = 255)
    String shortDescription;

    String description;

    @NotNull(message = "FIELD_REQUIRED")
    Long brandId;

    @NotNull(message = "FIELD_REQUIRED")
    Long categoryId;

    Boolean active;

    @Valid
    List<ProductVariantRequest> variants;

    @Valid
    List<ProductMediaRequest> media;
}
