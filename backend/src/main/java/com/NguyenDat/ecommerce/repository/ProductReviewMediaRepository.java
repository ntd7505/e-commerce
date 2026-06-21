package com.NguyenDat.ecommerce.repository;

import com.NguyenDat.ecommerce.entity.ProductReviewMedia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReviewMediaRepository
        extends JpaRepository<ProductReviewMedia, Long> {

    Page<ProductReviewMedia>
    findAllByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(
            Long productId,
            Pageable pageable
    );

    long countByReviewProductIdAndReviewDeletedFalseAndReviewActiveTrue(
            Long productId
    );
}
