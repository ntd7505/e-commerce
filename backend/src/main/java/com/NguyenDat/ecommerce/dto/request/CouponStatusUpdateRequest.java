package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponStatusUpdateRequest {
    @NotNull(message = "COUPON_STATUS_REQUIRED")
    Boolean active;
}
