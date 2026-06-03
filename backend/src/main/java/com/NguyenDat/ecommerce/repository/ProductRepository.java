package com.NguyenDat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByBrandIdAndDeletedFalse(Long brandId);

    boolean existsByCategoryIdAndDeletedFalse(Long id);

    List<Product> findAllByDeletedFalse();

    List<Product> findAllByDeletedFalseAndActiveTrue();

    Page<Product> findAllByDeletedFalseAndActiveTrue(Pageable pageable);

    Optional<Product> findByIdAndDeletedFalse(Long id);

    Optional<Product> findBySlugAndDeletedFalseAndActiveTrue(String slug);

    Page<Product> findAllByDeletedFalse(Pageable pageable);
}
