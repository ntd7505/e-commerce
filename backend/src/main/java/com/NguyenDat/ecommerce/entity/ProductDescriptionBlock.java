package com.NguyenDat.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NguyenDat.ecommerce.enums.ProductDescriptionBlockType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "product_description_blocks")
public class ProductDescriptionBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_description_block_id")
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 30)
    ProductDescriptionBlockType type;

    @Column(length = 200)
    String title;

    @Column(columnDefinition = "LONGTEXT")
    String content;

    @Column(name = "image_url", length = 500)
    String imageUrl;

    @Column(name = "alt_text", length = 255)
    String altText;

    @Column(name = "sort_order", nullable = false)
    int sortOrder;

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
