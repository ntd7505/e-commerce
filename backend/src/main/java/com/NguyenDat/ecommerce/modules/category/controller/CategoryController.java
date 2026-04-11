package com.NguyenDat.ecommerce.modules.category.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryRequest;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;
import com.NguyenDat.ecommerce.modules.category.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping("/categories")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest categoryRequest) {
        return ApiResponse.of(ResponseCode.CATEGORY_CREATED, categoryService.createCategory(categoryRequest));
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.ofList(ResponseCode.CATEGORIES_FETCHED, categoryService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.CATEGORY_FETCHED, categoryService.getCategoryById(id));
    }

    @PutMapping("/categories/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @RequestBody @Valid CategoryRequest categoryRequest, @PathVariable Long id) {
        return ApiResponse.of(ResponseCode.CATEGORY_UPDATED, categoryService.updateCategoryById(categoryRequest, id));
    }

    @DeleteMapping("/categories/{id}")
    public ApiResponse<Void> deleteCategoryById(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ApiResponse.of(ResponseCode.CATEGORY_DELETED, null);
    }
}
