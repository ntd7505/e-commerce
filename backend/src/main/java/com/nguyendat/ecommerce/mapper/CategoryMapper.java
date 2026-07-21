package com.nguyendat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nguyendat.ecommerce.dto.request.CategoryRequest;
import com.nguyendat.ecommerce.dto.response.category.CategoryChildResponse;
import com.nguyendat.ecommerce.dto.response.category.CategoryParentResponse;
import com.nguyendat.ecommerce.dto.response.category.CategoryResponse;
import com.nguyendat.ecommerce.dto.response.category.CategorySummaryResponse;
import com.nguyendat.ecommerce.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "parentCategory", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toCategory(CategoryRequest request);

    @Mapping(target = "parent", source = "parentCategory")
    @Mapping(target = "children", source = "children")
    CategoryResponse toCategoryResponse(Category category);

    CategoryParentResponse toCategoryParentResponse(Category category);

    CategoryChildResponse toCategoryChildResponse(Category category);

    CategorySummaryResponse toCategorySummaryResponse(Category category);
}

