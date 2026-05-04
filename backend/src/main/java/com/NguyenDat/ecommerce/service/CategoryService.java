package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.CategoryRequest;
import com.NguyenDat.ecommerce.dto.response.CategoryResponse;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategoryById(CategoryRequest categoryRequest, Long id);

    CategoryResponse getCategoryById(Long id);

    void deleteCategoryById(Long id);
}
