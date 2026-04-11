package com.NguyenDat.ecommerce.modules.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.modules.category.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsById(Long id);

    boolean existsByNameAndParentCategoryIsNull(String name);

    boolean existsByNameAndParentCategory_Id(String name, Long id);

    boolean existsBySlug(String slug);

    boolean existsByNameAndParentCategoryIsNullAndIdNot(String name, Long id);

    boolean existsByNameAndParentCategory_IdAndIdNot(String name, Long id, Long id2);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
