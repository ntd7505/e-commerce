package com.NguyenDat.ecommerce.modules.role.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import com.NguyenDat.ecommerce.modules.permission.entity.Permission;
import com.NguyenDat.ecommerce.modules.user.entity.User;

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
