package com.NguyenDat.ecommerce.modules.product.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMediaUpdateRequest {
    @Size(max = 500)
    String url;

    @Size(max = 50)
    String mediaType;

    Boolean thumbnail;

    @Min(0)
    Integer sortOrder;

    @Size(max = 255)
    String altText;

    Boolean active;
}
