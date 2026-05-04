package com.NguyenDat.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NguyenDat.ecommerce.entity.InvalidatedToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    boolean existsById(String id);
}
