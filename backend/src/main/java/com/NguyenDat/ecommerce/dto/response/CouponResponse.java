package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.NguyenDat.ecommerce.enums.DiscountType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CouponResponse {
    Long id;

    String code;

    String name;

    String description;

    DiscountType discountType;

    BigDecimal discountValue;

    BigDecimal minOrderAmount;

    BigDecimal maxDiscountAmount;

    Integer usageLimit;

    Integer usedCount;

    Integer perUserLimit;

    LocalDateTime startAt;

    LocalDateTime endAt;

    boolean active;

    boolean deleted;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
