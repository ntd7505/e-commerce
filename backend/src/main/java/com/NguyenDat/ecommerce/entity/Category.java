package com.NguyenDat.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

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
