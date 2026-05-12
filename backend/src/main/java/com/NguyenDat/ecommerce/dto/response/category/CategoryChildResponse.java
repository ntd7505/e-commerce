package com.NguyenDat.ecommerce.dto.response.category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryChildResponse {
    Long id;
    String name;
    String slug;
    boolean active;
}
