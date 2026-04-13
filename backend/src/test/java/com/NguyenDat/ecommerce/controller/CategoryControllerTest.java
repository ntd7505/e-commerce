package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.controller.CategoryController;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryChildResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryParentResponse;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryRequest;
import com.NguyenDat.ecommerce.modules.category.dto.CategoryResponse;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.service.CategoryService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(CategoryController.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    CategoryService categoryService;

    CategoryRequest categoryRequest;
    CategoryResponse categoryResponse;
    CategoryChildResponse categoryChildResponse;
    CategoryParentResponse categoryParentResponse;
    Category category;

    @BeforeEach
    void setUp() {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(null)
                .build();

        categoryParentResponse = CategoryParentResponse.builder()
                .id(1L)
                .name("Danh muc goc")
                .slug("danh-muc-goc")
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
                .build();

        category = Category.builder()
                .id(1L)
                .name("Dien tu")
                .slug("dien-tu")
                .description("Danh muc dien tu")
                .active(true)
                .deleted(false)
                .children(List.of(childCategory))
                .build();

        childCategory.setParentCategory(category);
    }

    @Test
    void createCategory_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(categoryService.createCategory(any(CategoryRequest.class))).thenReturn(categoryResponse);
        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CATEGORY_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CATEGORY_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.name").value("Dien tu"))
                .andExpect(jsonPath("$.data.description").value("Danh muc dien tu"))
                .andExpect(jsonPath("$.data.slug").value("dien-tu"))
                .andExpect(jsonPath("$.data.active").value(true))
                .andExpect(jsonPath("$.data.parent").doesNotExist())
                .andExpect(jsonPath("$.data.children[0].id").value(2))
                .andExpect(jsonPath("$.data.children[0].name").value("Laptop"))
                .andExpect(jsonPath("$.data.children[0].slug").value("laptop"))
                .andExpect(jsonPath("$.data.children[0].active").value(true));
        ;
        verify(categoryService).createCategory(any(CategoryRequest.class));
    }

    @Test
    void createCategory_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        categoryRequest = CategoryRequest.builder()
                .name("")
                .description("Danh muc dien tu")
                .parentCategoryId(null)
                .build();
        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(categoryService, never()).createCategory(any(CategoryRequest.class));
    }

    @Test
    void createCategory_shouldReturnErrorResponse_whenParentCategoryNotFound() throws Exception {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(1L)
                .build();
        when(categoryService.createCategory(any(CategoryRequest.class)))
                .thenThrow(new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().is(ErrorCode.PARENT_CATEGORY_NOT_FOUND
                        .getStatusCode()
                        .value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PARENT_CATEGORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PARENT_CATEGORY_NOT_FOUND.getMessage()));

        verify(categoryService).createCategory(any(CategoryRequest.class));
    }

    @Test
    void createCategory_shouldReturnErrorResponse_whenCategoryAlreadyExists() throws Exception {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu")
                .description("Danh muc dien tu")
                .parentCategoryId(1L)
                .build();
        when(categoryService.createCategory(any(CategoryRequest.class)))
                .thenThrow(new AppException(ErrorCode.CATEGORY_EXISTED));
        mockMvc.perform(post("/api/v1/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_EXISTED.getMessage()));

        verify(categoryService).createCategory(any(CategoryRequest.class));
    }

    @Test
    void getAllCategories_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        List<CategoryResponse> categoryResponseList = new ArrayList<>();
        categoryResponseList.add(categoryResponse);
        when(categoryService.getAllCategories()).thenReturn(categoryResponseList);
        mockMvc.perform(get("/api/v1/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CATEGORIES_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CATEGORIES_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data[0].name").value("Dien tu"))
                .andExpect(jsonPath("$.data[0].description").value("Danh muc dien tu"))
                .andExpect(jsonPath("$.data[0].slug").value("dien-tu"))
                .andExpect(jsonPath("$.data[0].active").value(true))
                .andExpect(jsonPath("$.data[0].parent").doesNotExist())
                .andExpect(jsonPath("$.data[0].children[0].id").value(2))
                .andExpect(jsonPath("$.data[0].children[0].name").value("Laptop"))
                .andExpect(jsonPath("$.data[0].children[0].slug").value("laptop"))
                .andExpect(jsonPath("$.data[0].children[0].active").value(true));

        verify(categoryService).getAllCategories();
    }

    @Test
    void getAllCategories_shouldReturnNoDataFound_whenListIsEmpty() throws Exception {
        when(categoryService.getAllCategories()).thenReturn(List.of());
        mockMvc.perform(get("/api/v1/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.NO_DATA_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.NO_DATA_FOUND.getMessage()))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
        verify(categoryService).getAllCategories();
    }

    @Test
    void getCategoryById_shouldReturnFetchedResponse_whenCategoryExists() throws Exception {
        when(categoryService.getCategoryById(1L)).thenReturn(categoryResponse);
        mockMvc.perform(get("/api/v1/admin/categories/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CATEGORY_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CATEGORY_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.name").value("Dien tu"))
                .andExpect(jsonPath("$.data.description").value("Danh muc dien tu"))
                .andExpect(jsonPath("$.data.slug").value("dien-tu"))
                .andExpect(jsonPath("$.data.active").value(true))
                .andExpect(jsonPath("$.data.parent").doesNotExist())
                .andExpect(jsonPath("$.data.children[0].id").value(2))
                .andExpect(jsonPath("$.data.children[0].name").value("Laptop"))
                .andExpect(jsonPath("$.data.children[0].slug").value("laptop"))
                .andExpect(jsonPath("$.data.children[0].active").value(true));

        verify(categoryService).getCategoryById(1L);
    }

    @Test
    void getCategoryById_shouldReturnErrorResponse_whenCategoryNotFound() throws Exception {
        when(categoryService.getCategoryById(1L)).thenThrow(new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        mockMvc.perform(get("/api/v1/admin/categories/{id}", 1L))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_NOT_FOUND.getMessage()));

        verify(categoryService).getCategoryById(1L);
    }

    @Test
    void getCategoryById_shouldReturnErrorResponse_whenCategoryDeleted() throws Exception {
        category.setDeleted(true);
        when(categoryService.getCategoryById(1L)).thenThrow(new AppException(ErrorCode.CATEGORY_DELETED));
        mockMvc.perform(get("/api/v1/admin/categories/{id}", 1L))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_DELETED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_DELETED.getMessage()));

        verify(categoryService).getCategoryById(1L);
    }

    @Test
    void updateCategory_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        categoryRequest = CategoryRequest.builder()
                .name("Dien tu update")
                .description("Danh muc dien tu update")
                .parentCategoryId(null)
                .build();

        categoryResponse = CategoryResponse.builder()
                .name("Dien tu update")
                .description("Danh muc dien tu update")
                .slug("dien-tu-update")
                .active(true)
                .parent(null)
                .children(List.of(categoryChildResponse))
                .build();

        when(categoryService.updateCategoryById(any(CategoryRequest.class), eq(1L)))
                .thenReturn(categoryResponse);
        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CATEGORY_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CATEGORY_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.name").value("Dien tu update"))
                .andExpect(jsonPath("$.data.description").value("Danh muc dien tu update"))
                .andExpect(jsonPath("$.data.slug").value("dien-tu-update"))
                .andExpect(jsonPath("$.data.active").value(true))
                .andExpect(jsonPath("$.data.parent").doesNotExist())
                .andExpect(jsonPath("$.data.children[0].id").value(2))
                .andExpect(jsonPath("$.data.children[0].name").value("Laptop"))
                .andExpect(jsonPath("$.data.children[0].slug").value("laptop"))
                .andExpect(jsonPath("$.data.children[0].active").value(true));

        verify(categoryService).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void updateCategory_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        categoryRequest = CategoryRequest.builder()
                .name("")
                .description("Danh muc dien tu update")
                .parentCategoryId(null)
                .build();

        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(categoryService, never()).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void updateCategory_shouldReturnErrorResponse_whenCategoryNotFound() throws Exception {
        when(categoryService.updateCategoryById(any(CategoryRequest.class), eq(1L)))
                .thenThrow(new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_NOT_FOUND.getMessage()));

        verify(categoryService).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void updateCategory_shouldReturnErrorResponse_whenParentCategoryNotFound() throws Exception {
        when(categoryService.updateCategoryById(any(CategoryRequest.class), eq(1L)))
                .thenThrow(new AppException(ErrorCode.PARENT_CATEGORY_NOT_FOUND));
        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().is(ErrorCode.PARENT_CATEGORY_NOT_FOUND
                        .getStatusCode()
                        .value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PARENT_CATEGORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PARENT_CATEGORY_NOT_FOUND.getMessage()));

        verify(categoryService).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void updateCategory_shouldReturnErrorResponse_whenCategoryAlreadyExists() throws Exception {
        when(categoryService.updateCategoryById(any(CategoryRequest.class), eq(1L)))
                .thenThrow(new AppException(ErrorCode.CATEGORY_EXISTED));
        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_EXISTED.getMessage()));

        verify(categoryService).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void updateCategory_shouldReturnErrorResponse_whenCircularReference() throws Exception {
        when(categoryService.updateCategoryById(any(CategoryRequest.class), eq(1L)))
                .thenThrow(new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE));
        mockMvc.perform(put("/api/v1/admin/categories/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().is(ErrorCode.CATEGORY_CIRCULAR_REFERENCE
                        .getStatusCode()
                        .value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_CIRCULAR_REFERENCE.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_CIRCULAR_REFERENCE.getMessage()));

        verify(categoryService).updateCategoryById(any(CategoryRequest.class), eq(1L));
    }

    @Test
    void deleteCategory_shouldReturnDeletedResponse_whenCategoryExists() throws Exception {
        doNothing().when(categoryService).deleteCategoryById(1L);
        mockMvc.perform(delete("/api/v1/admin/categories/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.CATEGORY_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.CATEGORY_DELETED.getMessage()));

        verify(categoryService).deleteCategoryById(1L);
    }

    @Test
    void deleteCategory_shouldReturnErrorResponse_whenCategoryNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.CATEGORY_NOT_FOUND))
                .when(categoryService)
                .deleteCategoryById(1L);

        mockMvc.perform(delete("/api/v1/admin/categories/{id}", 1L))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_NOT_FOUND.getMessage()));

        verify(categoryService).deleteCategoryById(1L);
    }

    @Test
    void deleteCategory_shouldReturnErrorResponse_whenCategoryDeleted() throws Exception {
        doThrow(new AppException(ErrorCode.CATEGORY_DELETED))
                .when(categoryService)
                .deleteCategoryById(1L);

        mockMvc.perform(delete("/api/v1/admin/categories/{id}", 1L))
                .andExpect(
                        status().is(ErrorCode.CATEGORY_DELETED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_DELETED.getMessage()));

        verify(categoryService).deleteCategoryById(1L);
    }

    @Test
    void deleteCategory_shouldReturnErrorResponse_whenCategoryHasProducts() throws Exception {
        doThrow(new AppException(ErrorCode.CATEGORY_HAS_PRODUCTS))
                .when(categoryService)
                .deleteCategoryById(1L);

        mockMvc.perform(delete("/api/v1/admin/categories/{id}", 1L))
                .andExpect(status().is(
                                ErrorCode.CATEGORY_HAS_PRODUCTS.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_HAS_PRODUCTS.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_HAS_PRODUCTS.getMessage()));

        verify(categoryService).deleteCategoryById(1L);
    }

    @Test
    void deleteCategory_shouldReturnErrorResponse_whenCategoryHasChildren() throws Exception {
        doThrow(new AppException(ErrorCode.CATEGORY_HAS_CHILDREN))
                .when(categoryService)
                .deleteCategoryById(1L);

        mockMvc.perform(delete("/api/v1/admin/categories/{id}", 1L))
                .andExpect(status().is(
                                ErrorCode.CATEGORY_HAS_CHILDREN.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.CATEGORY_HAS_CHILDREN.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.CATEGORY_HAS_CHILDREN.getMessage()));

        verify(categoryService).deleteCategoryById(1L);
    }
}
