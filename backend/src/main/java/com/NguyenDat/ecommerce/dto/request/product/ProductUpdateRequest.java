package com.NguyenDat.ecommerce.dto.request.product;

import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {

    @Size(max = 200)
    String name;

    @Size(max = 255)
    String shortDescription;

    String description;
    Long brandId;
    Long categoryId;
    Boolean active;
}
