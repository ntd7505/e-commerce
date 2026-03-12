package com.NguyenDat.ecommerce.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Entity
@Table(name = "roles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    String name;

    String description;

    @ManyToMany(mappedBy = "roles")
    Set<User> userSet = new HashSet<>();

    @Builder.Default
    @ManyToMany
    Set<Permission> permissions = new HashSet<>();
}
