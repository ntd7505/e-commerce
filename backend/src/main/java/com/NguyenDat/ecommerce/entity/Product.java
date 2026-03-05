package com.NguyenDat.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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

    @Column(columnDefinition = "LONGTEXT")
    String description;

    @Column(nullable = false, length = 200)
    String brand;

    @Column(nullable = false)
    boolean active = true;

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
