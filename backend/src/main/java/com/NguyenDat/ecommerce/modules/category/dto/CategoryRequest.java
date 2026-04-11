package com.NguyenDat.ecommerce.modules.category.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    @NotBlank(message = "FIELD_REQUIRED")
    String name;

    String description;

    Long parentCategoryId;
}
