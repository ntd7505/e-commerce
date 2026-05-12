package com.NguyenDat.ecommerce.dto.response;

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
