package com.NguyenDat.ecommerce.modules.category.entity;

import java.util.List;

import jakarta.persistence.*;

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
    Long id;

    @Column(nullable = false, length = 255)
    String name;

    @OneToMany(mappedBy = "category")
    List<Product> product;
}
