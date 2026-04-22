package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
import com.NguyenDat.ecommerce.modules.product.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.modules.product.entity.Brand;
import com.NguyenDat.ecommerce.modules.product.mapper.BrandMapper;
import com.NguyenDat.ecommerce.modules.product.repository.BrandRepository;
import com.NguyenDat.ecommerce.modules.product.repository.ProductRepository;
import com.NguyenDat.ecommerce.modules.product.service.BrandService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandServiceTest {
    @Mock
    BrandRepository brandRepository;

    @Mock
    ProductRepository productRepository;

    @Mock
    BrandMapper brandMapper;

    @InjectMocks
    BrandService brandService;

    BrandRequest brandRequest;
    Brand brand;
    BrandResponse brandResponse;

    @BeforeEach
    void setUp() {
        brandRequest = BrandRequest.builder().name("Nike").logoUrl("nike.com").build();

        brand = new Brand();
        brand.setId(1L);
        brand.setName("Nike");
        brand.setSlug("nike");
        brand.setLogoUrl("nike.com");
        brand.setActive(true);
        brand.setDeleted(false);

        brandResponse = BrandResponse.builder()
                .id(1L)
                .name("Nike")
                .slug("nike")
                .logoUrl("nike.com")
                .active(true)
                .build();
    }

    @Test
    void createBrand_shouldReturnBrandResponse_whenRequestIsValid() {
        when(brandRepository.findByNameAndDeletedFalse("Nike")).thenReturn(Optional.empty());
        when(brandRepository.existsBySlug("nike")).thenReturn(false);
        when(brandMapper.toBrand(brandRequest)).thenReturn(brand);
        when(brandRepository.save(brand)).thenReturn(brand);
        when(brandMapper.toBrandResponse(brand)).thenReturn(brandResponse);

        BrandResponse result = brandService.createBrand(brandRequest);

        assertEquals("Nike", brand.getName());
        assertEquals("nike", brand.getSlug());
        assertEquals("nike.com", brand.getLogoUrl());

        assertEquals(1L, result.getId());
        assertEquals("Nike", result.getName());
        assertEquals("nike", result.getSlug());
        assertEquals("nike.com", result.getLogoUrl());
        verify(brandRepository).save(brand);
    }

    @Test
    void createBrand_shouldThrowException_whenBrandNameAlreadyExists() {
        when(brandRepository.findByNameAndDeletedFalse("Nike")).thenReturn(Optional.of(brand));
        AppException exception = assertThrows(AppException.class, () -> brandService.createBrand(brandRequest));
        assertEquals(ErrorCode.BRAND_EXISTED, exception.getErrorCode());
        verify(brandRepository, never()).save(any());
    }

    @Test
    void getAllBrands_shouldReturnOnlyNonDeletedBrands() {
        Brand deletedBrand = new Brand();
        deletedBrand.setId(2L);
        deletedBrand.setName("Adidas");
        deletedBrand.setActive(true);
        deletedBrand.setDeleted(true);

        when(brandRepository.findAllByDeletedFalse()).thenReturn(List.of(brand));
        when(brandMapper.toBrandResponse((brand))).thenReturn(brandResponse);

        List<BrandResponse> result = brandService.getAllBrands();

        assertEquals(1, result.size());
        assertEquals("Nike", result.getFirst().getName());
        verify(brandMapper, never()).toBrandResponse(deletedBrand);
    }

    @Test
    void getBrandById_shouldThrowException_whenBrandIsDeleted() {
        brand.setDeleted(true);
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> brandService.getBrandById(1L));
        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void updateBrandById_shouldThrowException_whenBrandNameAlreadyExists() {
        BrandRequest updateRequest = BrandRequest.builder().name("Nike").build();
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(brand));
        when(brandRepository.existsByNameAndDeletedFalseAndIdNot("Nike", 1L)).thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> brandService.updateBrandById(1L, updateRequest));
        assertEquals(ErrorCode.BRAND_EXISTED, exception.getErrorCode());
        verify(brandRepository, never()).save(any());
    }

    @Test
    void deleteBrand_shouldMarkBrandAsDeleted_whenBrandExists() {
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(brand));
        when(brandRepository.save(brand)).thenReturn(brand);
        when(productRepository.existsByBrandIdAndDeletedFalse(1L)).thenReturn(false);
        brandService.deleteBrand(1L);
        assertTrue(brand.isDeleted());
        verify(brandRepository).save(brand);
    }

    @Test
    void deleteBrand_shouldThrowException_whenBrandIsAlreadyDeleted() {
        brand.setDeleted(true);
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> brandService.deleteBrand(1L));
        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
        verify(brandRepository, never()).save(any());
    }

    @Test
    void getBrandById_shouldThrowException_whenBrandDoesNotExist() {
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> brandService.getBrandById(1L));
        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
        verify(brandRepository, never()).save(any());
    }

    @Test
    void updateBrandById_shouldReturnBrandResponse_whenRequestIsValid() {
        BrandRequest updateRequest = BrandRequest.builder().name("Nike").build();
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(brand));
        when(brandRepository.existsByNameAndDeletedFalseAndIdNot("Nike", 1L)).thenReturn(false);
        when(brandRepository.save(brand)).thenReturn(brand);
        when(brandMapper.toBrandResponse(brand)).thenReturn(brandResponse);

        BrandResponse result = brandService.updateBrandById(1L, updateRequest);
        assertEquals("Nike", result.getName());
        assertTrue(result.isActive());
        verify(brandRepository).save(brand);
    }

    @Test
    void updateBrandById_shouldThrowException_whenBrandIsDeleted() {
        BrandRequest updateRequest = BrandRequest.builder().name("Nike").build();
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception =
                assertThrows(AppException.class, () -> brandService.updateBrandById(1L, updateRequest));

        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
        verify(brandRepository, never()).save(any());
    }
}
