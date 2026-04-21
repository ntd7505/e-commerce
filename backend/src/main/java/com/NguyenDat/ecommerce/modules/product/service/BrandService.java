package com.NguyenDat.ecommerce.modules.product.service;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.product.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.BrandStatusUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.modules.product.entity.Brand;
import com.NguyenDat.ecommerce.modules.product.mapper.BrandMapper;
import com.NguyenDat.ecommerce.modules.product.repository.BrandRepository;
import com.NguyenDat.ecommerce.modules.product.repository.ProductRepository;
import com.NguyenDat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;
    ProductRepository productRepository;

    public BrandResponse createBrand(BrandRequest brandRequest) {
        String normalizedName = brandRequest.getName().trim();
        if (brandRepository.findByName(normalizedName).isPresent()) {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }

        Brand brand = brandMapper.toBrand(brandRequest);
        brand.setName(normalizedName);
        brand.setSlug(SlugUtil.toUniqueSlug(normalizedName, brandRepository::existsBySlug));

        try {
            return brandMapper.toBrandResponse(brandRepository.save(brand));
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }
    }

    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAllByDeletedFalse().stream()
                .map(brandMapper::toBrandResponse)
                .toList();
    }

    public void deleteBrand(Long id) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        if (productRepository.existsByBrandIdAndDeletedFalse(id)) {
            throw new AppException(ErrorCode.BRAND_HAS_PRODUCTS);
        }
        brand.setDeleted(true);
        brand.setActive(false);
        brandRepository.save(brand);
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        return brandMapper.toBrandResponse(brand);
    }

    public BrandResponse updateBrandById(Long id, BrandRequest brandRequest) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        String normalizedName = brandRequest.getName().trim();
        if (brandRepository.existsByNameAndIdNot(normalizedName, id)) {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }
        brand.setName(normalizedName);
        brand.setSlug(SlugUtil.toUniqueSlug(normalizedName, slug -> brandRepository.existsBySlugAndIdNot(slug, id)));
        brand.setLogoUrl(brandRequest.getLogoUrl());
        brandRepository.save(brand);
        return brandMapper.toBrandResponse(brand);
    }

    public List<BrandResponse> getDeletedBrands() {
        return brandRepository.findAllByDeletedTrue().stream()
                .map(brandMapper::toBrandResponse)
                .toList();
    }

    public BrandResponse updateBrandStatusById(@Valid BrandStatusUpdateRequest brandStatusUpdateRequest, Long id) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        brand.setActive(brandStatusUpdateRequest.getActive());
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }
}
