package com.nguyendat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsById(Long id);

    boolean existsByNameAndDeletedFalseAndParentCategoryIsNull(String name);

    boolean existsByNameAndDeletedFalseAndParentCategory_Id(String name, Long id);

    boolean existsBySlug(String slug);

    boolean existsByNameAndDeletedFalseAndParentCategoryIsNullAndIdNot(String name, Long id);

    boolean existsByNameAndDeletedFalseAndParentCategory_IdAndIdNot(String name, Long id, Long id2);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Category> findAllByDeletedFalse();

    Page<Category> findAllByDeletedFalse(Pageable pageable);

    List<Category> findAllByDeletedFalseAndActiveTrue();

    Optional<Category> findByIdAndDeletedFalse(Long id);

    Optional<Category> findByIdAndDeletedFalseAndActiveTrue(Long id);

    boolean existsByParentCategoryIdAndDeletedFalse(Long id);
}

