package com.NguyenDat.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NguyenDat.ecommerce.enums.BannerPosition;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "home_banners")
public class HomeBanner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    BannerPosition position;

    @Column(length = 255)
    String title;

    @Column(length = 255)
    String subtitle;

    @Column(name = "image_url", length = 255)
    String imageUrl;

    @Column(name = "mobile_image_url", length = 255)
    String mobileImageUrl;

    @Column(name = "background_color", length = 50)
    String backgroundColor;

    @Builder.Default
    @Column(name = "sort_order", nullable = false)
    int sortOrder = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    boolean isActive = false;

    @Column(name = "starts_at")
    LocalDateTime startsAt;

    @Column(name = "ends_at")
    LocalDateTime endsAt;

    @Builder.Default
    @Column(nullable = false)
    boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
