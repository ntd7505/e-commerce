package com.NguyenDat.ecommerce.modules.category.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.modules.category.dto.CategoryChildResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryParentResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryRequest;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategorySummaryResponse;
import com.NguyenDat.ecommerce.modules.category.entity.Category;

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
