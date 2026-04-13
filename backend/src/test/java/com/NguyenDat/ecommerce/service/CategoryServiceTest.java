package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryChildResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryParentResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryRequest;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.mapper.CategoryMapper;
import com.NguyenDat.ecommerce.modules.category.repository.CategoryRepository;
import com.NguyenDat.ecommerce.modules.category.service.CategoryService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryServiceTest {

    @Mock
    CategoryRepository categoryRepository;

    @Mock
    CategoryMapper categoryMapper;

    @InjectMocks
    CategoryService categoryService;

    CategoryRequest categoryRequest;
    CategoryRequest categoryUpdateRequest;
    CategoryRequest categoryUpdateRequestTrimmed;
    CategoryRequest categoryUpdateWithParentRequest;
    CategoryResponse categoryResponse;
    CategoryParentResponse categoryParentResponse;
    CategoryChildResponse categoryChildResponse;
    Category category;

    @BeforeEach
    void setUp() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(null)
                .build();

        categoryUpdateRequest = CategoryRequest.builder()
                .name("Dien tu update")
                .description("Danh muc dien tu update")
                .parentCategoryId(null)
                .build();

        categoryUpdateRequestTrimmed = CategoryRequest.builder()
                .name("  Dien tu update  ")
                .description("Danh muc dien tu update")
                .parentCategoryId(null)
                .build();

        categoryUpdateWithParentRequest = CategoryRequest.builder()
                .name("Laptop update")
                .description("Danh muc laptop update")
                .parentCategoryId(10L)
                .build();

        categoryParentResponse = CategoryParentResponse.builder()
                .id(10L)
                .name("Danh muc cha")
                .slug("danh-muc-cha")
                .build();

        categoryChildResponse = CategoryChildResponse.builder()
                .id(2L)
                .name("Laptop")
                .slug("laptop")
                .active(true)
                .build();

        categoryResponse = CategoryResponse.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .slug("dien-tu")
                .active(true)
                .parent(null)
                .children(List.of(categoryChildResponse))
                .build();

        Category childCategory = Category.builder()
                .id(2L)
                .name("Laptop")
                .slug("laptop")
                .description("Danh muc laptop")
                .active(true)
                .deleted(false)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        category = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(false)
                .parentCategory(null)
                .children(new ArrayList<>(List.of(childCategory)))
                .products(new ArrayList<>())
                .build();

        childCategory.setParentCategory(category);
    }

    @Test
    void createCategory_shouldCreateRootCategory_whenRequestIsValid() {
        when(categoryRepository.existsByNameAndParentCategoryIsNull("Dien tu")).thenReturn(false);
        when(categoryRepository.existsBySlug("dien-tu")).thenReturn(false);
        when(categoryMapper.toCategory(categoryRequest)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(categoryResponse);

        CategoryResponse rs = categoryService.createCategory(categoryRequest);
        assertEquals("Dien tu", rs.getName());
        assertEquals("Danh muc dien tu", rs.getDescription());
        assertEquals("dien-tu", rs.getSlug());

        verify(categoryRepository, never()).findById(anyLong());
        verify(categoryRepository).existsByNameAndParentCategoryIsNull("Dien tu");
        verify(categoryRepository).existsBySlug("dien-tu");
        verify(categoryRepository).save(category);
    }

    @Test
    void createCategory_shouldCreateChildCategory_whenParentExists() {
        Category categoryParent = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(false)
                .parentCategory(null)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        categoryRequest = CategoryRequest.builder()
                .name("Thiet bi")
                .description("Danh muc thiet bi")
                .parentCategoryId(1L)
                .build();

        Category childCategory = Category.builder()
                .id(2L)
                .name("Thiet bi")
                .description("Danh muc thiet bi")
                .active(true)
                .deleted(false)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        CategoryResponse childCategoryResponse = CategoryResponse.builder()
                .name("Thiet bi")
                .description("Danh muc thiet bi")
                .slug("thiet-bi")
                .active(true)
                .parent(categoryParentResponse)
                .children(List.of())
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(categoryParent));
        when(categoryMapper.toCategory(categoryRequest)).thenReturn(childCategory);
        when(categoryRepository.existsBySlug("thiet-bi")).thenReturn(false);
        when(categoryRepository.existsByNameAndParentCategory_Id("Thiet bi", 1L))
                .thenReturn(false);
        when(categoryRepository.save(childCategory)).thenReturn(childCategory);
        when(categoryMapper.toCategoryResponse(childCategory)).thenReturn(childCategoryResponse);

        CategoryResponse rs = categoryService.createCategory(categoryRequest);

        assertEquals("Thiet bi", rs.getName());
        assertEquals("Danh muc thiet bi", rs.getDescription());
        assertEquals("thiet-bi", rs.getSlug());
        assertEquals(categoryParent, childCategory.getParentCategory());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).existsByNameAndParentCategoryIsNull("Thiet bi");
        verify(categoryRepository).existsByNameAndParentCategory_Id("Thiet bi", 1L);
        verify(categoryRepository).existsBySlug("thiet-bi");
        verify(categoryRepository).save(childCategory);
        verify(categoryMapper).toCategoryResponse(childCategory);
    }

    @Test
    void createCategory_shouldTrimNameBeforeSaving() {
        categoryRequest = CategoryRequest.builder()
                .name("  Dien tu  ")
                .description("Danh muc dien tu")
                .parentCategoryId(null)
                .build();
        when(categoryRepository.existsByNameAndParentCategoryIsNull("Dien tu")).thenReturn(false);
        when(categoryRepository.existsBySlug("dien-tu")).thenReturn(false);
        when(categoryMapper.toCategory(categoryRequest)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(categoryResponse);

        CategoryResponse rs = categoryService.createCategory(categoryRequest);
        assertEquals("Dien tu", rs.getName());
        assertEquals("Danh muc dien tu", rs.getDescription());
        assertEquals("dien-tu", rs.getSlug());

        verify(categoryRepository, never()).findById(anyLong());
        verify(categoryRepository).existsByNameAndParentCategoryIsNull("Dien tu");
        verify(categoryRepository).existsBySlug("dien-tu");
        verify(categoryRepository).save(category);
    }

    @Test
    void createCategory_shouldThrowException_whenParentCategoryNotFound() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(1L)
                .build();
        AppException exception =
                assertThrows(AppException.class, () -> categoryService.createCategory(categoryRequest));
        assertEquals(ErrorCode.PARENT_CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryMapper, never()).toCategory(categoryRequest);
        verify(categoryRepository, never()).existsBySlug("dien-tu");
        verify(categoryMapper, never()).toCategoryResponse(category);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void createCategory_shouldThrowException_whenParentCategoryIsDeleted() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(1L)
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        category.setDeleted(true);
        AppException exception =
                assertThrows(AppException.class, () -> categoryService.createCategory(categoryRequest));
        assertEquals(ErrorCode.PARENT_CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryMapper, never()).toCategory(categoryRequest);
        verify(categoryRepository, never()).existsBySlug("dien-tu");
        verify(categoryMapper, never()).toCategoryResponse(category);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void createCategory_shouldThrowException_whenRootCategoryNameAlreadyExists() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(null)
                .build();
        when(categoryRepository.existsByNameAndParentCategoryIsNull("Dien tu")).thenReturn(true);

        AppException exception =
                assertThrows(AppException.class, () -> categoryService.createCategory(categoryRequest));
        assertEquals(ErrorCode.CATEGORY_EXISTED, exception.getErrorCode());
        verify(categoryMapper, never()).toCategory(categoryRequest);
        verify(categoryRepository, never()).existsBySlug("dien-tu");
        verify(categoryMapper, never()).toCategoryResponse(category);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void createCategory_shouldThrowException_whenChildCategoryNameAlreadyExistsUnderSameParent() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(1L)
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndParentCategory_Id("Dien tu", 1L)).thenReturn(true);

        AppException exception =
                assertThrows(AppException.class, () -> categoryService.createCategory(categoryRequest));
        assertEquals(ErrorCode.CATEGORY_EXISTED, exception.getErrorCode());
        verify(categoryMapper, never()).toCategory(categoryRequest);
        verify(categoryRepository, never()).existsBySlug("dien-tu");
        verify(categoryMapper, never()).toCategoryResponse(category);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void createCategory_shouldGenerateUniqueSlug_whenSlugAlreadyExists() {
        when(categoryRepository.existsByNameAndParentCategoryIsNull("Dien tu")).thenReturn(false);
        when(categoryMapper.toCategory(categoryRequest)).thenReturn(category);
        when(categoryRepository.existsBySlug("dien-tu")).thenReturn(true);
        when(categoryRepository.existsBySlug("dien-tu-1")).thenReturn(false);

        category.setSlug("dien-tu-1");
        categoryResponse.setSlug("dien-tu-1");

        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(categoryResponse);

        CategoryResponse rs = categoryService.createCategory(categoryRequest);
        assertEquals("Dien tu", rs.getName());
        assertEquals("Danh muc dien tu", rs.getDescription());
        assertEquals("dien-tu-1", rs.getSlug());

        verify(categoryRepository, never()).findById(anyLong());
        verify(categoryRepository).existsByNameAndParentCategoryIsNull("Dien tu");
        verify(categoryRepository).existsBySlug("dien-tu");
        verify(categoryRepository).existsBySlug("dien-tu-1");
        verify(categoryRepository).save(category);
    }

    @Test
    void getAllCategories_shouldReturnOnlyActiveAndNonDeletedCategories() {
        Category categoryIsDeleted = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(true)
                .parentCategory(null)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();
        when(categoryRepository.findAll()).thenReturn(List.of(category, categoryIsDeleted));
        when(categoryMapper.toCategoryResponse(category)).thenReturn(categoryResponse);
        List<CategoryResponse> rs = categoryService.getAllCategories();
        assertEquals(1, rs.size());
        assertEquals(categoryResponse.getName(), rs.getFirst().getName());
        assertEquals(categoryResponse.getSlug(), rs.getFirst().getSlug());
        assertEquals(categoryResponse.getDescription(), rs.getFirst().getDescription());

        verify(categoryMapper).toCategoryResponse(category);
        verify(categoryMapper, never()).toCategoryResponse(categoryIsDeleted);
    }

    @Test
    void getAllCategories_shouldReturnEmptyList_whenNoValidCategoriesExist() {

        when(categoryRepository.findAll()).thenReturn(List.of());
        List<CategoryResponse> rs = categoryService.getAllCategories();
        assertTrue(rs.isEmpty());
        verify(categoryRepository).findAll();
        verify(categoryMapper, never()).toCategoryResponse(any());
    }

    @Test
    void getCategoryById_shouldReturnCategoryResponse_whenCategoryExists() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryMapper.toCategoryResponse(category)).thenReturn(categoryResponse);
        CategoryResponse rs = categoryService.getCategoryById(1L);
        assertEquals(category.getName(), rs.getName());
        assertEquals(category.getSlug(), rs.getSlug());
        assertEquals(category.getDescription(), rs.getDescription());

        verify(categoryRepository).findById(1L);
        verify(categoryMapper).toCategoryResponse(category);
    }

    @Test
    void getCategoryById_shouldThrowException_whenCategoryNotFound() {
        AppException exception = assertThrows(AppException.class, () -> categoryService.getCategoryById(1L));
        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void getCategoryById_shouldThrowException_whenCategoryIsDeleted() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        category.setDeleted(true);
        AppException exception = assertThrows(AppException.class, () -> categoryService.getCategoryById(1L));
        assertEquals(ErrorCode.CATEGORY_DELETED, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldUpdateCategory_whenRequestIsValid() {
        CategoryResponse updatedCategoryResponse = CategoryResponse.builder()
                .name("Dien tu update")
                .description("Danh muc dien tu update")
                .slug("dien-tu-update")
                .active(true)
                .parent(null)
                .children(List.of(categoryChildResponse))
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L))
                .thenReturn(false);
        when(categoryRepository.existsBySlugAndIdNot("dien-tu-update", 1L)).thenReturn(false);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(updatedCategoryResponse);

        CategoryResponse rs = categoryService.updateCategoryById(categoryUpdateRequest, 1L);

        assertEquals(categoryUpdateRequest.getName(), rs.getName());
        assertEquals(categoryUpdateRequest.getDescription(), rs.getDescription());
        assertEquals("dien-tu-update", rs.getSlug());

        assertEquals("Dien tu update", category.getName());
        assertEquals("Danh muc dien tu update", category.getDescription());
        assertEquals("dien-tu-update", category.getSlug());
        assertNull(category.getParentCategory());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L);
        verify(categoryRepository).existsBySlugAndIdNot("dien-tu-update", 1L);
        verify(categoryRepository).save(category);
        verify(categoryMapper).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldTrimNameBeforeUpdating() {
        CategoryResponse updatedCategoryResponse = CategoryResponse.builder()
                .name("Dien tu update")
                .description("Danh muc dien tu update")
                .slug("dien-tu-update")
                .active(true)
                .parent(null)
                .children(List.of(categoryChildResponse))
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L))
                .thenReturn(false);
        when(categoryRepository.existsBySlugAndIdNot("dien-tu-update", 1L)).thenReturn(false);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(updatedCategoryResponse);

        CategoryResponse rs = categoryService.updateCategoryById(categoryUpdateRequestTrimmed, 1L);

        assertEquals("Dien tu update", rs.getName());
        assertEquals(categoryUpdateRequestTrimmed.getDescription(), rs.getDescription());
        assertEquals("dien-tu-update", rs.getSlug());

        assertEquals("Dien tu update", category.getName());
        assertEquals("Danh muc dien tu update", category.getDescription());
        assertEquals("dien-tu-update", category.getSlug());
        assertNull(category.getParentCategory());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L);
        verify(categoryRepository).existsBySlugAndIdNot("dien-tu-update", 1L);
        verify(categoryRepository).save(category);
        verify(categoryMapper).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldKeepSlug_whenNameDoesNotChange() {

        categoryUpdateRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu update")
                .parentCategoryId(null)
                .build();

        CategoryResponse updatedCategoryResponse = CategoryResponse.builder()
                .name("Dien tu")
                .description("Danh muc dien tu update")
                .slug("dien-tu")
                .active(true)
                .parent(null)
                .children(List.of(categoryChildResponse))
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndParentCategoryIsNullAndIdNot("Dien tu", 1L))
                .thenReturn(false);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toCategoryResponse(category)).thenReturn(updatedCategoryResponse);

        CategoryResponse rs = categoryService.updateCategoryById(categoryUpdateRequest, 1L);

        assertEquals(categoryUpdateRequest.getName(), rs.getName());
        assertEquals(categoryUpdateRequest.getDescription(), rs.getDescription());
        assertEquals("dien-tu", rs.getSlug());

        assertEquals("Dien tu", category.getName());
        assertEquals("Danh muc dien tu update", category.getDescription());
        assertEquals("dien-tu", category.getSlug());
        assertNull(category.getParentCategory());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).existsByNameAndParentCategoryIsNullAndIdNot("Dien tu", 1L);
        verify(categoryRepository, never()).existsBySlugAndIdNot(anyString(), eq(1L));
        verify(categoryRepository).save(category);
        verify(categoryMapper).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenCategoryNotFound() {
        AppException exception =
                assertThrows(AppException.class, () -> categoryService.updateCategoryById(categoryUpdateRequest, 1L));
        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenCategoryIsDeleted() {
        category.setDeleted(true);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        AppException exception =
                assertThrows(AppException.class, () -> categoryService.updateCategoryById(categoryUpdateRequest, 1L));
        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenParentCategoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(categoryUpdateWithParentRequest.getParentCategoryId()))
                .thenReturn(Optional.empty());
        AppException exception = assertThrows(
                AppException.class, () -> categoryService.updateCategoryById(categoryUpdateWithParentRequest, 1L));

        assertEquals(ErrorCode.PARENT_CATEGORY_NOT_FOUND, exception.getErrorCode());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).findById(categoryUpdateWithParentRequest.getParentCategoryId());
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenParentCategoryIsDeleted() {
        Category categoryParent = Category.builder()
                .id(1L)
                .name("Dien tu cha")
                .slug("dien-tu-cha")
                .description("Danh muc dien tu cha")
                .active(true)
                .deleted(true)
                .parentCategory(null)
                .children(new ArrayList<>(List.of(category)))
                .products(new ArrayList<>())
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(categoryUpdateWithParentRequest.getParentCategoryId()))
                .thenReturn(Optional.of(categoryParent));
        AppException exception = assertThrows(
                AppException.class, () -> categoryService.updateCategoryById(categoryUpdateWithParentRequest, 1L));

        assertEquals(ErrorCode.PARENT_CATEGORY_NOT_FOUND, exception.getErrorCode());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).findById(categoryUpdateWithParentRequest.getParentCategoryId());
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenParentCategoryIsSelf() {
        categoryUpdateWithParentRequest = CategoryRequest.builder()
                .name("Laptop update")
                .description("Danh muc laptop update")
                .parentCategoryId(1L)
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(categoryUpdateWithParentRequest.getParentCategoryId()))
                .thenReturn(Optional.of(category));
        AppException exception = assertThrows(
                AppException.class, () -> categoryService.updateCategoryById(categoryUpdateWithParentRequest, 1L));

        assertEquals(ErrorCode.CATEGORY_CIRCULAR_REFERENCE, exception.getErrorCode());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).findById(categoryUpdateWithParentRequest.getParentCategoryId());
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenParentCategoryIsDescendant() {

        categoryUpdateWithParentRequest = CategoryRequest.builder()
                .name("Laptop update")
                .description("Danh muc laptop update")
                .parentCategoryId(10L)
                .build();

        Category categoryParent = Category.builder()
                .id(10L)
                .name("Dien tu cha")
                .slug("dien-tu-cha")
                .description("Danh muc dien tu cha")
                .active(true)
                .deleted(false)
                .parentCategory(category)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(categoryUpdateWithParentRequest.getParentCategoryId()))
                .thenReturn(Optional.of(categoryParent));
        AppException exception = assertThrows(
                AppException.class, () -> categoryService.updateCategoryById(categoryUpdateWithParentRequest, 1L));

        assertEquals(ErrorCode.CATEGORY_CIRCULAR_REFERENCE, exception.getErrorCode());

        verify(categoryRepository).findById(1L);
        verify(categoryRepository).findById(categoryUpdateWithParentRequest.getParentCategoryId());
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenRootCategoryNameAlreadyExists() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L))
                .thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> categoryService.updateCategoryById(categoryUpdateRequest, 1L));
        assertEquals(ErrorCode.CATEGORY_EXISTED, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository).existsByNameAndParentCategoryIsNullAndIdNot("Dien tu update", 1L);
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void updateCategoryById_shouldThrowException_whenChildCategoryNameAlreadyExistsUnderSameParent() {
        Category categoryParent = Category.builder()
                .id(10L)
                .name("Dien tu cha")
                .slug("dien-tu-cha")
                .description("Danh muc dien tu cha")
                .active(true)
                .deleted(false)
                .parentCategory(null)
                .children(new ArrayList<>(List.of(category)))
                .products(new ArrayList<>())
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(categoryUpdateWithParentRequest.getParentCategoryId()))
                .thenReturn(Optional.of(categoryParent));
        when(categoryRepository.existsByNameAndParentCategory_IdAndIdNot("Laptop update", 10L, 1L))
                .thenReturn(true);
        AppException exception = assertThrows(
                AppException.class, () -> categoryService.updateCategoryById(categoryUpdateWithParentRequest, 1L));
        assertEquals(ErrorCode.CATEGORY_EXISTED, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository).findById(10L);
        verify(categoryRepository).existsByNameAndParentCategory_IdAndIdNot("Laptop update", 10L, 1L);
        verify(categoryRepository, never()).save(category);
        verify(categoryMapper, never()).toCategoryResponse(category);
    }

    @Test
    void deleteCategoryById_shouldSoftDeleteCategory_whenCategoryHasNoChildrenAndNoProducts() {
        category = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(false)
                .parentCategory(null)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);
        categoryService.deleteCategoryById(1L);
        verify(categoryRepository).findById(1L);
        verify(categoryRepository).save(category);
    }

    @Test
    void deleteCategoryById_shouldThrowException_whenCategoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> categoryService.deleteCategoryById(1L));
        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void deleteCategoryById_shouldThrowException_whenCategoryIsDeleted() {
        category.setDeleted(true);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        AppException exception = assertThrows(AppException.class, () -> categoryService.deleteCategoryById(1L));
        assertEquals(ErrorCode.CATEGORY_DELETED, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void deleteCategoryById_shouldThrowException_whenCategoryHasActiveChildren() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        AppException exception = assertThrows(AppException.class, () -> categoryService.deleteCategoryById(1L));
        assertEquals(ErrorCode.CATEGORY_HAS_CHILDREN, exception.getErrorCode());
        verify(categoryRepository).findById(1L);
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void deleteCategoryById_shouldIgnoreDeletedChildren_whenDeletingCategory() {
        Category childCategory = Category.builder()
                .id(2L)
                .name("Laptop")
                .slug("laptop")
                .description("Danh muc laptop")
                .active(true)
                .deleted(true)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        category = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(false)
                .parentCategory(null)
                .children(new ArrayList<>(List.of(childCategory)))
                .products(new ArrayList<>())
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);
        categoryService.deleteCategoryById(1L);
        verify(categoryRepository).findById(1L);
        verify(categoryRepository).save(category);
    }

    //    @Test
    //    void deleteCategoryById_shouldThrowException_whenCategoryHasActiveProducts() {
    //
    //    }
    //
    //    @Test
    //    void deleteCategoryById_shouldIgnoreDeletedProducts_whenDeletingCategory() {
    //
    //    }
}
