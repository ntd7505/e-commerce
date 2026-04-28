package com.NguyenDat.ecommerce.modules.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NguyenDat.ecommerce.modules.auth.entity.InvalidatedToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    boolean existsById(String id);
}
