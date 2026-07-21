package com.nguyendat.ecommerce.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.CategoryRequest;
import com.nguyendat.ecommerce.dto.request.PageRequest;
import com.nguyendat.ecommerce.dto.response.category.CategoryResponse;
import com.nguyendat.ecommerce.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.ADMIN_ONLY)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @RequestBody @Valid CategoryRequest categoryRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.CATEGORY_CREATED, categoryService.createCategory(categoryRequest)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<PageResponse<CategoryResponse>>> getCategoriesPage(
            @Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.CATEGORIES_FETCHED, categoryService.getCategoriesInPage(pageRequest.toPageable())));
    }

    @GetMapping("/categories/all")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.CATEGORIES_FETCHED, categoryService.getAllCategories()));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CATEGORY_FETCHED, categoryService.getCategoryById(id)));
    }

    @PatchMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @RequestBody @Valid CategoryRequest categoryRequest, @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.CATEGORY_UPDATED, categoryService.updateCategoryById(categoryRequest, id)));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategoryById(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CATEGORY_DELETED, null));
    }
}

