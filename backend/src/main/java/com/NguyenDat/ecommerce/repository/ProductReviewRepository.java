package com.NguyenDat.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.ProductReview;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    List<ProductReview> findAllByProductIdAndDeletedFalseAndActiveTrue(Long productId);
}
