package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminTopProductResponse {
    Long productId;
    String productName;
    String thumbnailUrl;
    Long quantitySold;
    BigDecimal revenue;
}
