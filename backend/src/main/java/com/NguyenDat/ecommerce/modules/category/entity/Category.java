package com.NguyenDat.ecommerce.modules.category.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.NguyenDat.ecommerce.modules.product.entity.Product;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 255)
    String name;

    @Column(unique = true, length = 255)
    String slug;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false)
    boolean active = true;

    @Column(nullable = false)
    boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    Category parentCategory;

    @OneToMany(mappedBy = "parentCategory")
    List<Category> children = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    List<Product> products = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
