package com.NguyenDat.ecommerce.entity;

import com.NguyenDat.ecommerce.enums.Active;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 100)
    String email;

    @Column(nullable = false, length = 250)
    String password;

    @Column(name = "full_name", nullable = false, length = 100)
    String fullName;

    @Column(name = "phone_number", unique = true, nullable = false, length = 20)
    String phoneNumber;

    @Column(name = "avatar_url")
    String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    Active status;

    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_name")
    )
    Set<Role> roles = new HashSet<>();

    @Column(nullable = false, columnDefinition = "boolean default true")
    boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;

}
