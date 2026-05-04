package com.NguyenDat.ecommerce.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Long id;
    String name;
    String description;
    String slug;
    boolean active;
    CategoryParentResponse parent;
    List<CategoryChildResponse> children;
}
