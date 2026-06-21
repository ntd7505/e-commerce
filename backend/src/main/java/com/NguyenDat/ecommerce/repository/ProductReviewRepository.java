package com.NguyenDat.ecommerce.repository;

import com.NguyenDat.ecommerce.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long>, JpaSpecificationExecutor<ProductReview> {

    List<ProductReview> findAllByProductIdAndDeletedFalseAndActiveTrue(Long productId);

    boolean existsByOrderItemId(Long orderItemId);

    long countByProductIdAndDeletedFalseAndActiveTrue(Long productId);
}
