package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
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
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.dto.CategorySummaryResponse;
import com.NguyenDat.ecommerce.modules.product.controller.admin.AdminProductController;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductCreateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductVariantRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductVariantUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandSummaryResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.modules.product.service.ProductService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AdminProductController.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    ProductService productService;

    ProductCreateRequest productCreateRequest;
    ProductUpdateRequest productUpdateRequest;
    ProductVariantUpdateRequest productVariantUpdateRequest;
    ProductResponse productResponse;
    ProductVariantResponse productVariantResponse;

    @BeforeEach
    void setUp() {
        productCreateRequest = ProductCreateRequest.builder()
                .name("Ao Hoodie")
                .shortDescription("Hoodie form rong")
                .description("Mo ta san pham")
                .brandId(1L)
                .categoryId(2L)
                .active(true)
                .variants(List.of(ProductVariantRequest.builder()
                        .variantName("Den - M")
                        .stockQuantity(10)
                        .price(350000)
                        .salePrice(289000)
                        .currency("VND")
                        .build()))
                .media(null)
                .build();

        productUpdateRequest = ProductUpdateRequest.builder()
                .name("Ao Hoodie Updated")
                .shortDescription("Hoodie updated")
                .description("Mo ta updated")
                .brandId(1L)
                .categoryId(2L)
                .active(true)
                .build();

        productVariantUpdateRequest = ProductVariantUpdateRequest.builder()
                .variantName("Den - L")
                .stockQuantity(15)
                .price(360000.0)
                .salePrice(300000.0)
                .currency("VND")
                .active(true)
                .build();

        productVariantResponse = ProductVariantResponse.builder()
                .id(100L)
                .variantName("Den - M")
                .stockQuantity(10)
                .price(350000)
                .salePrice(289000)
                .currency("VND")
                .sku("AO-HOODIE-DEN-M")
                .active(true)
                .build();

        ProductMediaResponse productMediaResponse = ProductMediaResponse.builder()
                .id(200L)
                .url("https://cdn.test/product.jpg")
                .mediaType("image")
                .isThumbnail(true)
                .sortOrder(0)
                .altText("Product image")
                .active(true)
                .build();

        productResponse = ProductResponse.builder()
                .id(10L)
                .name("Ao Hoodie")
                .slug("ao-hoodie")
                .shortDescription("Hoodie form rong")
                .description("Mo ta san pham")
                .brand(BrandSummaryResponse.builder()
                        .id(1L)
                        .name("Nike")
                        .slug("nike")
                        .build())
                .category(CategorySummaryResponse.builder()
                        .id(2L)
                        .name("Hoodie")
                        .slug("hoodie")
                        .build())
                .active(true)
                .variants(List.of(productVariantResponse))
                .media(List.of(productMediaResponse))
                .build();
    }

    @Test
    void createProduct_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(productService.createProduct(any(ProductCreateRequest.class))).thenReturn(productResponse);

        mockMvc.perform(post("/api/v1/admin/products")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productCreateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.name").value("Ao Hoodie"))
                .andExpect(jsonPath("$.data.slug").value("ao-hoodie"))
                .andExpect(jsonPath("$.data.variants[0].id").value(100))
                .andExpect(jsonPath("$.data.media[0].id").value(200));

        verify(productService).createProduct(any(ProductCreateRequest.class));
    }

    @Test
    void createProduct_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        productCreateRequest.setName("");

        mockMvc.perform(post("/api/v1/admin/products")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productCreateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(productService, never()).createProduct(any(ProductCreateRequest.class));
    }

    @Test
    void getAllProducts_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        List<ProductResponse> productResponses = new ArrayList<>();
        productResponses.add(productResponse);
        when(productService.getAllProducts()).thenReturn(productResponses);

        mockMvc.perform(get("/api/v1/admin/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCTS_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCTS_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].name").value("Ao Hoodie"));

        verify(productService).getAllProducts();
    }

    @Test
    void getAllProducts_shouldReturnNoDataFound_whenListIsEmpty() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/admin/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCTS_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCTS_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(0));

        verify(productService).getAllProducts();
    }

    @Test
    void getProductById_shouldReturnFetchedResponse_whenProductExists() throws Exception {
        when(productService.getProductById(10L)).thenReturn(productResponse);

        mockMvc.perform(get("/api/v1/admin/products/{id}", 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.name").value("Ao Hoodie"));

        verify(productService).getProductById(10L);
    }

    @Test
    void getProductById_shouldReturnErrorResponse_whenProductNotFound() throws Exception {
        when(productService.getProductById(10L)).thenThrow(new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        mockMvc.perform(get("/api/v1/admin/products/{id}", 10L))
                .andExpect(
                        status().is(ErrorCode.PRODUCT_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PRODUCT_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PRODUCT_NOT_FOUND.getMessage()));

        verify(productService).getProductById(10L);
    }

    @Test
    void getVariantById_shouldReturnFetchedResponse_whenVariantExists() throws Exception {
        when(productService.getVariantById(100L)).thenReturn(productVariantResponse);

        mockMvc.perform(get("/api/v1/admin/products/variants/{id}", 100L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_VARIANT_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_VARIANT_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.variantName").value("Den - M"))
                .andExpect(jsonPath("$.data.sku").value("AO-HOODIE-DEN-M"));

        verify(productService).getVariantById(100L);
    }

    @Test
    void updateProductById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        when(productService.updateProductById(any(ProductUpdateRequest.class), eq(10L)))
                .thenReturn(productResponse);

        mockMvc.perform(put("/api/v1/admin/products/{id}", 10L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.name").value("Ao Hoodie"));

        verify(productService).updateProductById(any(ProductUpdateRequest.class), eq(10L));
    }

    @Test
    void updateVariantById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        when(productService.updateVariantById(any(ProductVariantUpdateRequest.class), eq(100L)))
                .thenReturn(productVariantResponse);

        mockMvc.perform(put("/api/v1/admin/products/variants/{id}", 100L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productVariantUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(100))
                .andExpect(jsonPath("$.data.variantName").value("Den - M"));

        verify(productService).updateVariantById(any(ProductVariantUpdateRequest.class), eq(100L));
    }

    @Test
    void deleteProductVariant_shouldReturnDeletedResponse_whenVariantExists() throws Exception {
        doNothing().when(productService).deleteProductVariantsById(100L);

        mockMvc.perform(delete("/api/v1/admin/products/variants/{id}", 100L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PRODUCT_VARIANT_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.PRODUCT_VARIANT_DELETED.getMessage()));

        verify(productService).deleteProductVariantsById(100L);
    }

    @Test
    void deleteProductVariant_shouldReturnErrorResponse_whenVariantNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND))
                .when(productService)
                .deleteProductVariantsById(100L);

        mockMvc.perform(delete("/api/v1/admin/products/variants/{id}", 100L))
                .andExpect(status().is(ErrorCode.PRODUCT_VARIANT_NOT_FOUND
                        .getStatusCode()
                        .value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PRODUCT_VARIANT_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PRODUCT_VARIANT_NOT_FOUND.getMessage()));

        verify(productService).deleteProductVariantsById(100L);
    }
}
