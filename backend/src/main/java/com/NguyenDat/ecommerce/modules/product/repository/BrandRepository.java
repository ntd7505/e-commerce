package com.NguyenDat.ecommerce.modules.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.modules.product.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

//    Optional<Brand> findByName(String name);

    boolean existsByNameAndDeletedFalseAndIdNot(String name, long id);

    boolean existsBySlug(String name);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Brand> findAllByDeletedFalse();

    List<Brand> findAllByDeletedTrue();

    Optional<Brand> findByIdAndDeletedFalse(Long id);

    Optional<Brand> findByNameAndDeletedFalse(String name);
}
