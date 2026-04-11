package com.NguyenDat.ecommerce.modules.category.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryRequest;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.mapper.CategoryMapper;
import com.NguyenDat.ecommerce.modules.category.repository.CategoryRepository;
import com.NguyenDat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    CategoryRepository categoryRepository;

    CategoryMapper categoryMapper;

    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        String normalizedName = categoryRequest.getName().trim();
        Category parentCategory = null;
        if (categoryRequest.getParentCategoryId() != null) {
            parentCategory = categoryRepository
                    .findById(categoryRequest.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
            if (parentCategory.isDeleted()) {
                throw new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND);
            }
        }
        boolean existed;
        if (parentCategory == null) {
            existed = categoryRepository.existsByNameAndParentCategoryIsNull(normalizedName);
        } else {
            existed = categoryRepository.existsByNameAndParentCategory_Id(normalizedName, parentCategory.getId());
        }
        if (existed) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        Category category = categoryMapper.toCategory(categoryRequest);
        category.setName(normalizedName);
        category.setActive(true);
        category.setParentCategory(parentCategory);
        category.setSlug(SlugUtil.toUniqueSlug(normalizedName, categoryRepository::existsBySlug));

        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .filter(category -> !category.isDeleted() && category.isActive())
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse updateCategoryById(@Valid CategoryRequest categoryRequest, Long id) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (category.isDeleted()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        String normalizedName = categoryRequest.getName().trim();
        Category parentCategory = null;

        if (categoryRequest.getParentCategoryId() != null) {
            if (categoryRequest.getParentCategoryId().equals(id)) {
                throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
            }
            parentCategory = categoryRepository
                    .findById(categoryRequest.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
        }

        if (parentCategory != null && parentCategory.isDeleted()) {
            throw new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND);
        }

        if (parentCategory != null && isDescendant(category, parentCategory)) {
            throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
        }

        boolean existed;
        if (parentCategory == null) {
            existed = categoryRepository.existsByNameAndParentCategoryIsNullAndIdNot(normalizedName, id);
        } else {
            existed = categoryRepository.existsByNameAndParentCategory_IdAndIdNot(
                    normalizedName, parentCategory.getId(), id);
        }

        if (existed) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        if (!normalizedName.equals(category.getName())) {
            category.setSlug(
                    SlugUtil.toUniqueSlug(normalizedName, slug -> categoryRepository.existsBySlugAndIdNot(slug, id)));
        }
        category.setName(normalizedName);
        category.setDescription(categoryRequest.getDescription());
        category.setParentCategory(parentCategory);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (category.isDeleted()) {
            throw new AppException(ErrorCode.CATEGORY_DELETED);
        }
        return categoryMapper.toCategoryResponse(category);
    }

    public void deleteCategoryById(Long id) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (category.isDeleted()) {
            throw new AppException(ErrorCode.CATEGORY_DELETED);
        }
        boolean hasChildren = category.getChildren().stream().anyMatch(child -> !child.isDeleted());
        boolean hasProducts = category.getProducts().stream().anyMatch(product -> !product.isDeleted());
        if (hasProducts) {
            throw new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS);
        }
        if (hasChildren) {
            throw new AppException(ErrorCode.CATEGORY_HAS_CHILDREN);
        }
        category.setDeleted(true);
        categoryRepository.save(category);
    }

    private boolean isDescendant(Category category, Category parentCategory) {
        Category currentParent = parentCategory;
        while (currentParent != null) {
            if (category.getId().equals(currentParent.getId())) {
                return true;
            }
            currentParent = currentParent.getParentCategory();
        }
        return false;
    }
}
