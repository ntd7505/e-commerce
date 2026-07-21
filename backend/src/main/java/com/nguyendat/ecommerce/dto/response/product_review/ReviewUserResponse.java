package com.nguyendat.ecommerce.dto.response.product_review;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewUserResponse {
    Long id;
    String fullName;
    String avatarUrl;
}

