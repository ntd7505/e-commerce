package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.product.controller.admin.AdminBrandController;
import com.NguyenDat.ecommerce.modules.product.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.modules.product.service.BrandService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AdminBrandController.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    BrandService brandService;

    BrandRequest brandRequest;
    BrandResponse response;

    @BeforeEach
    void setUp() {
        brandRequest = BrandRequest.builder().name("Nike").logoUrl("nike.com").build();

        response = BrandResponse.builder()
                .id(1L)
                .name("Nike")
                .slug("nike")
                .logoUrl("nike.com")
                .active(true)
                .build();
    }

    @Test
    void createBrand_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(brandService.createBrand(any(BrandRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/brands")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(6000))
                .andExpect(jsonPath("$.message").value("Brand created successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Nike"))
                .andExpect(jsonPath("$.data.slug").value("nike"))
                .andExpect(jsonPath("$.data.logoUrl").value("nike.com"))
                .andExpect(jsonPath("$.data.active").value(true));

        verify(brandService).createBrand(any(BrandRequest.class));
    }

    @Test
    void createBrand_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        brandRequest = BrandRequest.builder().name("").logoUrl("nike.com").build();
        mockMvc.perform(post("/api/v1/admin/brands")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isBadRequest());

        verify(brandService, never()).createBrand(any());
    }

    @Test
    void createBrand_shouldReturnErrorResponse_whenBrandAlreadyExists() throws Exception {
        when(brandService.createBrand(any(BrandRequest.class))).thenThrow(new AppException(ErrorCode.BRAND_EXISTED));
        mockMvc.perform(post("/api/v1/admin/brands")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(4000))
                .andExpect(jsonPath("$.message").value("Brand already existed"));
        verify(brandService).createBrand(any(BrandRequest.class));
    }

    @Test
    void getAllBrands_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        List<BrandResponse> brandResponseList = new ArrayList<>();
        brandResponseList.add(response);
        when(brandService.getAllBrands()).thenReturn(brandResponseList);
        mockMvc.perform(get("/api/v1/admin/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(6004))
                .andExpect(jsonPath("$.message").value("Brands fetched successfully"))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Nike"))
                .andExpect(jsonPath("$.data[0].slug").value("nike"))
                .andExpect(jsonPath("$.data[0].logoUrl").value("nike.com"))
                .andExpect(jsonPath("$.data[0].active").value(true));

        verify(brandService).getAllBrands();
    }

    @Test
    void getAllBrands_shouldReturnNoDataFound_whenListIsEmpty() throws Exception {
        List<BrandResponse> brandResponseList = new ArrayList<>();
        when(brandService.getAllBrands()).thenReturn(brandResponseList);
        mockMvc.perform(get("/api/v1/admin/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1005))
                .andExpect(jsonPath("$.message").value("No data found"))
                .andExpect(jsonPath("$.data.length()").value(0));
        verify(brandService).getAllBrands();
    }

    @Test
    void getBrandById_shouldReturnFetchedResponse_whenBrandExists() throws Exception {
        when(brandService.getBrandById(1L)).thenReturn(response);
        mockMvc.perform(get("/api/v1/admin/brands/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(6001))
                .andExpect(jsonPath("$.message").value("Brand fetched successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Nike"))
                .andExpect(jsonPath("$.data.slug").value("nike"))
                .andExpect(jsonPath("$.data.logoUrl").value("nike.com"))
                .andExpect(jsonPath("$.data.active").value(true));

        verify(brandService).getBrandById(1L);
    }

    @Test
    void getBrandById_shouldReturnErrorResponse_whenBrandNotFound() throws Exception {
        when(brandService.getBrandById(1L)).thenThrow(new AppException(ErrorCode.BRAND_NOT_FOUND));
        mockMvc.perform(get("/api/v1/admin/brands/{id}", 1L))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(4001))
                .andExpect(jsonPath("$.message").value("Brand not found"));
        verify(brandService).getBrandById(1L);
    }

    @Test
    void updateBrandById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        when(brandService.updateBrandById(eq(1L), any(BrandRequest.class))).thenReturn(response);
        mockMvc.perform(put("/api/v1/admin/brands/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(6002))
                .andExpect(jsonPath("$.message").value("Brand updated successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Nike"))
                .andExpect(jsonPath("$.data.slug").value("nike"))
                .andExpect(jsonPath("$.data.logoUrl").value("nike.com"))
                .andExpect(jsonPath("$.data.active").value(true));
        verify(brandService).updateBrandById(eq(1L), any(BrandRequest.class));
    }

    @Test
    void updateBrandById_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        brandRequest = BrandRequest.builder().name("").logoUrl("nike.com").build();
        mockMvc.perform(put("/api/v1/admin/brands/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(9998))
                .andExpect(jsonPath(("$.message")).value("Invalid request data"));
        verify(brandService, never()).updateBrandById(anyLong(), any(BrandRequest.class));
    }

    @Test
    void updateBrandById_shouldReturnErrorResponse_whenBrandAlreadyExists() throws Exception {
        when(brandService.updateBrandById(eq(1L), any(BrandRequest.class)))
                .thenThrow(new AppException(ErrorCode.BRAND_EXISTED));

        mockMvc.perform(put("/api/v1/admin/brands/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(4000))
                .andExpect(jsonPath("$.message").value("Brand already existed"));

        verify(brandService).updateBrandById(eq(1L), any(BrandRequest.class));
    }

    @Test
    void updateBrandById_shouldReturnErrorResponse_whenBrandNotFound() throws Exception {
        when(brandService.updateBrandById(eq(1L), any(BrandRequest.class)))
                .thenThrow(new AppException(ErrorCode.BRAND_NOT_FOUND));
        mockMvc.perform(put("/api/v1/admin/brands/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(brandRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(4001))
                .andExpect(jsonPath("$.message").value("Brand not found"));

        verify(brandService).updateBrandById(eq(1L), any(BrandRequest.class));
    }

    @Test
    void deleteBrand_shouldReturnDeletedResponse_whenBrandExists() throws Exception {
        doNothing().when(brandService).deleteBrand(1L);
        mockMvc.perform(delete("/api/v1/admin/brands/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(6003))
                .andExpect(jsonPath("$.message").value("Brand deleted successfully"));

        verify(brandService).deleteBrand(1L);
    }

    @Test
    void deleteBrand_shouldReturnErrorResponse_whenBrandNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.BRAND_NOT_FOUND)).when(brandService).deleteBrand(1L);

        mockMvc.perform(delete("/api/v1/admin/brands/{id}", 1L))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(4001))
                .andExpect(jsonPath("$.message").value("Brand not found"));

        verify(brandService).deleteBrand(1L);
    }
}
