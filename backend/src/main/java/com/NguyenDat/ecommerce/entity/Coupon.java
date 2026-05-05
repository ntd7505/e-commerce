package com.NguyenDat.ecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NguyenDat.ecommerce.enums.DiscountType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    Long id;

    @Column(nullable = false, unique = true, length = 64)
    String code;

    @Column(nullable = false, length = 150)
    String name;

    @Column(length = 500)
    String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    DiscountType discountType;

    @Column(nullable = false, name = "discount_value", precision = 12, scale = 2)
    BigDecimal discountValue;

    @Column(name = "min_order_amount", precision = 12, scale = 2)
    BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount", precision = 12, scale = 2)
    BigDecimal maxDiscountAmount;

    @Column(name = "usage_limit")
    Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    Integer usedCount = 0;

    @Column(name = "per_user_limit")
    Integer perUserLimit;

    @Column(name = "start_at")
    LocalDateTime startAt;

    @Column(name = "end_at")
    LocalDateTime endAt;

    @Column(nullable = false)
    boolean active = true;

    @Column(nullable = false)
    boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
