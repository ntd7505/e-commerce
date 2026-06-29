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
public class CouponValidationResponse {
    CouponResponse coupon;
    BigDecimal discountAmount;
}
