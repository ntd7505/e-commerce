package com.nguyendat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.constant.CacheName;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.CategoryRequest;
import com.nguyendat.ecommerce.dto.response.category.CategoryResponse;
import com.nguyendat.ecommerce.entity.Category;
import com.nguyendat.ecommerce.mapper.CategoryMapper;
import com.nguyendat.ecommerce.repository.CategoryRepository;
import com.nguyendat.ecommerce.repository.ProductRepository;
import com.nguyendat.ecommerce.service.CategoryService;
import com.nguyendat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    CategoryRepository categoryRepository;

    CategoryMapper categoryMapper;

    ProductRepository productRepository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        String normalizedName = categoryRequest.getName().trim();
        Category parentCategory = null;
        if (categoryRequest.getParentCategoryId() != null) {
            parentCategory = categoryRepository
                    .findByIdAndDeletedFalse(categoryRequest.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
        }
        boolean existed;
        if (parentCategory == null) {
            existed = categoryRepository.existsByNameAndDeletedFalseAndParentCategoryIsNull(normalizedName);
        } else {
            existed = categoryRepository.existsByNameAndDeletedFalseAndParentCategory_Id(
                    normalizedName, parentCategory.getId());
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
        return categoryRepository.findAllByDeletedFalse().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    @Override
    public PageResponse<CategoryResponse> getCategoriesInPage(Pageable pageable) {
        Page<Category> page = categoryRepository.findAllByDeletedFalse(pageable);
        return PageResponse.from(page.map(categoryMapper::toCategoryResponse));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.CATEGORIES, allEntries = true)
    public CategoryResponse updateCategoryById(@Valid CategoryRequest categoryRequest, Long id) {
        Category category = categoryRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        String normalizedName = categoryRequest.getName().trim();
        Category parentCategory = null;

        if (categoryRequest.getParentCategoryId() != null) {
            if (categoryRequest.getParentCategoryId().equals(id)) {
                throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
            }
            parentCategory = categoryRepository
                    .findByIdAndDeletedFalse(categoryRequest.getParentCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
        }

        if (parentCategory != null && isDescendant(category, parentCategory)) {
            throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
        }

        boolean existed;
        if (parentCategory == null) {
            existed = categoryRepository.existsByNameAndDeletedFalseAndParentCategoryIsNullAndIdNot(normalizedName, id);
        } else {
            existed = categoryRepository.existsByNameAndDeletedFalseAndParentCategory_IdAndIdNot(
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
        Category category = categoryRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.CATEGORIES, allEntries = true)
    public void deleteCategoryById(Long id) {
        Category category = categoryRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        boolean hasChildren = categoryRepository.existsByParentCategoryIdAndDeletedFalse(category.getId());
        boolean hasProducts = productRepository.existsByCategoryIdAndDeletedFalse(category.getId());
        if (hasProducts) {
            throw new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS);
        }
        if (hasChildren) {
            throw new AppException(ErrorCode.CATEGORY_HAS_CHILDREN);
        }
        category.setDeleted(true);
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Override
    @Cacheable(cacheNames = CacheName.CATEGORIES, key = "'all'")
    public List<CategoryResponse> showAllCategories() {
        return categoryRepository.findAllByDeletedFalseAndActiveTrue().stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public CategoryResponse showCategoryById(Long id) {
        Category category = categoryRepository
                .findByIdAndDeletedFalseAndActiveTrue(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
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

