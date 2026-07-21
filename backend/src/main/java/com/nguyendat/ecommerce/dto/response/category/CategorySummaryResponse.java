package com.nguyendat.ecommerce.dto.response.category;

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

