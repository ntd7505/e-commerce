package com.NguyenDat.ecommerce.modules.product.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    String url;

    @Column(name = "media_type", length = 250)
    String mediaType;

    @Column(name = "is_thumbnail")
    boolean isThumbnail;

    @Column(name = "sort_order")
    int sortOrder;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    Product product;
}
