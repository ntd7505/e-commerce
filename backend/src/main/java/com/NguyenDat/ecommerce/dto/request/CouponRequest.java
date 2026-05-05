package com.NguyenDat.ecommerce.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.*;

import com.NguyenDat.ecommerce.enums.DiscountType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponRequest {
    @NotBlank(message = "COUPON_CODE_REQUIRED")
    @Size(max = 64, message = "COUPON_CODE_INVALID")
    String code;

    @NotBlank(message = "COUPON_NAME_REQUIRED")
    @Size(max = 150, message = "COUPON_NAME_INVALID")
    String name;

    @Size(max = 500, message = "COUPON_DESCRIPTION_INVALID")
    String description;

    @NotNull(message = "DISCOUNT_TYPE_REQUIRED")
    DiscountType discountType;

    @NotNull(message = "DISCOUNT_VALUE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "DISCOUNT_VALUE_INVALID")
    BigDecimal discountValue;

    @DecimalMin(value = "0.0", message = "MIN_ORDER_AMOUNT_INVALID")
    BigDecimal minOrderAmount;

    @DecimalMin(value = "0.0", message = "MAX_DISCOUNT_AMOUNT_INVALID")
    BigDecimal maxDiscountAmount;

    @Min(value = 1, message = "USAGE_LIMIT_INVALID")
    Integer usageLimit;

    @Min(value = 1, message = "PER_USER_LIMIT_INVALID")
    Integer perUserLimit;

    LocalDateTime startAt;

    LocalDateTime endAt;
}
