package com.nguyendat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    boolean existsByNameAndDeletedFalseAndIdNot(String name, long id);

    boolean existsBySlug(String name);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Brand> findAllByDeletedFalse();

    Page<Brand> findAllByDeletedFalse(Pageable pageable);

    List<Brand> findAllByDeletedFalseAndActiveTrue();

    List<Brand> findAllByDeletedTrue();

    Page<Brand> findAllByDeletedTrue(Pageable pageable);

    Optional<Brand> findByIdAndDeletedFalse(Long id);

    Optional<Brand> findByIdAndDeletedFalseAndActiveTrue(Long id);

    Optional<Brand> findByNameAndDeletedFalse(String name);
}

