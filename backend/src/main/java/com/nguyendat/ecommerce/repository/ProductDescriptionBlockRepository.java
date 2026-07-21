package com.nguyendat.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.ProductDescriptionBlock;

@Repository
public interface ProductDescriptionBlockRepository extends JpaRepository<ProductDescriptionBlock, Long> {
    List<ProductDescriptionBlock> findAllByProductIdAndDeletedFalseOrderBySortOrderAsc(Long productId);
}

