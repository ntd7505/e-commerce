package com.nguyendat.ecommerce.dto.request.product;

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
public class ProductSpecificationRequest {
    @Size(max = 100)
    String groupName;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 150)
    String specKey;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(max = 500)
    String specValue;

    @Min(0)
    int sortOrder;

    Boolean active;
}

