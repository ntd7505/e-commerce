package com.nguyendat.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.ProductSpecification;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {
    List<ProductSpecification> findAllByProductIdAndDeletedFalseOrderBySortOrderAsc(Long productId);
}

