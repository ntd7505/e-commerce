package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.category.CategoryResponse;
import com.NguyenDat.ecommerce.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientCategoryController {

    CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> showAllCategories() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.CATEGORIES_FETCHED, categoryService.showAllCategories()));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> showCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.CATEGORY_FETCHED, categoryService.showCategoryById(id)));
    }
}
