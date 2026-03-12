package com.NguyenDat.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User getUserById(Long id);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
