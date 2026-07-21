package com.nguyendat.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.CategoryRequest;
import com.nguyendat.ecommerce.dto.response.category.CategoryResponse;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);

    List<CategoryResponse> getAllCategories();

    PageResponse<CategoryResponse> getCategoriesInPage(Pageable pageable);

    CategoryResponse updateCategoryById(CategoryRequest categoryRequest, Long id);

    CategoryResponse getCategoryById(Long id);

    void deleteCategoryById(Long id);

    List<CategoryResponse> showAllCategories();

    CategoryResponse showCategoryById(Long id);
}

