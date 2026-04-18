package com.NguyenDat.ecommerce.modules.category.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategorySummaryResponse {
    Long id;
    String name;
    String slug;
}
