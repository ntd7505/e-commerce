package com.nguyendat.ecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.ProductReviewMedia;

@Repository
public interface ProductReviewMediaRepository extends JpaRepository<ProductReviewMedia, Long> {

    Page<ProductReviewMedia> findAllByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(
            Long productId, Pageable pageable);

    long countByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(Long productId);
}

