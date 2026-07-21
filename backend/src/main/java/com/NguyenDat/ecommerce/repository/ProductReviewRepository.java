package com.NguyenDat.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.ProductReview;

@Repository
public interface ProductReviewRepository
        extends JpaRepository<ProductReview, Long>, JpaSpecificationExecutor<ProductReview> {

    List<ProductReview> findAllByProductIdAndDeletedFalseAndActiveTrue(Long productId);

    boolean existsByOrderItemId(Long orderItemId);

    long countByProductIdAndDeletedFalseAndActiveTrue(Long productId);

    Page<ProductReview> findAllByUserIdAndDeletedFalse(Long userId, Pageable pageable);

    Page<ProductReview> findAllByDeletedFalse(Pageable pageable);

    long countByDeletedFalse();

    long countByDeletedFalseAndActiveTrue();

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM ProductReview r WHERE r.deleted = false AND r.active = true")
    Double averageRatingForActiveReviews();

    @Query(
            "SELECT r.product.id AS productId, AVG(r.rating) AS statValue FROM ProductReview r WHERE r.product.id IN :productIds AND r.deleted = false AND r.active = true GROUP BY r.product.id")
    List<com.NguyenDat.ecommerce.repository.projection.ProductStatProjection> getAverageRatingByProductIds(
            @org.springframework.data.repository.query.Param("productIds") List<Long> productIds);
}
