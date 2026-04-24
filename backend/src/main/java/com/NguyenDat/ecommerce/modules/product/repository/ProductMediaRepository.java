package com.NguyenDat.ecommerce.modules.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.modules.product.entity.ProductMedia;

@Repository
public interface ProductMediaRepository extends JpaRepository<ProductMedia, Long> {
    boolean existsByProductIdAndUrlAndDeletedFalse(Long productId, String url);

    Optional<ProductMedia> findByIdAndDeletedFalse(Long id);

    boolean existsByProductIdAndUrlAndDeletedFalseAndIdNot(Long productId, String url, Long id);
}
