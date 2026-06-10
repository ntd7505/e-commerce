package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.controller.client.ClientBrandController;
import com.NguyenDat.ecommerce.controller.client.ClientCategoryController;
import com.NguyenDat.ecommerce.controller.client.ClientProductController;
import com.NguyenDat.ecommerce.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.category.CategoryResponse;
import com.NguyenDat.ecommerce.service.BrandService;
import com.NguyenDat.ecommerce.service.CategoryService;
import com.NguyenDat.ecommerce.service.ProductService;

@WebMvcTest({ClientProductController.class, ClientBrandController.class, ClientCategoryController.class})
@AutoConfigureMockMvc(addFilters = false)
class ClientCatalogControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ProductService productService;

    @MockitoBean
    BrandService brandService;

    @MockitoBean
    CategoryService categoryService;

    @Test
    void showProductsPage_shouldBindFilterAndReturnPage() throws Exception {
        ProductResponse product =
                ProductResponse.builder().id(1L).name("Keyboard").build();
        PageResponse<ProductResponse> page = PageResponse.<ProductResponse>builder()
                .content(List.of(product))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();
        when(productService.showProductsInPage(any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/client/products")
                        .param("keyword", "keyboard")
                        .param("minPrice", "100000")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].name").value("Keyboard"));
    }

    @Test
    void showProductBySlug_shouldReturnProductDetail() throws Exception {
        when(productService.showProductBySlug("keyboard"))
                .thenReturn(ProductResponse.builder().id(1L).name("Keyboard").build());

        mockMvc.perform(get("/api/v1/client/products/{slug}", "keyboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Keyboard"));
    }

    @Test
    void showBrandsAndCategories_shouldReturnVisibleCatalogData() throws Exception {
        when(brandService.showAllBrands())
                .thenReturn(
                        List.of(BrandResponse.builder().id(1L).name("Logitech").build()));
        when(categoryService.showAllCategories())
                .thenReturn(List.of(
                        CategoryResponse.builder().id(2L).name("Accessories").build()));

        mockMvc.perform(get("/api/v1/client/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Logitech"));
        mockMvc.perform(get("/api/v1/client/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Accessories"));
    }
}
