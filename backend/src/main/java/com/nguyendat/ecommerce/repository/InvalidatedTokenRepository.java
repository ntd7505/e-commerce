package com.nguyendat.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyendat.ecommerce.entity.InvalidatedToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    boolean existsById(String id);
}

