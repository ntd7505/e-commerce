package com.NguyenDat.ecommerce.modules.product.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NguyenDat.ecommerce.modules.category.entity.Category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 200)
    String name;

    @Column(nullable = false, unique = true, length = 255)
    String slug;

    @Column(name = "short_description", length = 255)
    String shortDescription;

    @Column(columnDefinition = "LONGTEXT")
    String description;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    Brand brand;

    @Column(nullable = false)
    boolean active = true;

    @Column(nullable = false)
    boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    Category category;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;
}
