package com.NguyenDat.ecommerce.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponValidationRequest {

    @NotBlank(message = "COUPON_CODE_REQUIRED")
    @Size(max = 64, message = "COUPON_CODE_INVALID")
    String code;

    @NotNull(message = "FIELD_REQUIRED")
    @DecimalMin(value = "0.0", message = "MIN_ORDER_AMOUNT_INVALID")
    BigDecimal subtotalAmount;
}
