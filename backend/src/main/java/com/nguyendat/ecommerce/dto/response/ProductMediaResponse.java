package com.nguyendat.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMediaResponse {
    private Long id;
    String url;
    String mediaType;
    boolean thumbnail;
    int sortOrder;
    String altText;

    @Builder.Default
    boolean active = true;
}

