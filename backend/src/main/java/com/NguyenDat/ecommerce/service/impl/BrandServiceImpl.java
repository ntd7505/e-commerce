package com.NguyenDat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.constant.CacheName;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.dto.request.BrandStatusUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.entity.Brand;
import com.NguyenDat.ecommerce.mapper.BrandMapper;
import com.NguyenDat.ecommerce.repository.BrandRepository;
import com.NguyenDat.ecommerce.repository.ProductRepository;
import com.NguyenDat.ecommerce.service.BrandService;
import com.NguyenDat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class BrandServiceImpl implements BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;
    ProductRepository productRepository;

    @Transactional
    public BrandResponse createBrand(BrandRequest brandRequest) {
        String normalizedName = brandRequest.getName().trim();
        if (brandRepository.findByNameAndDeletedFalse(normalizedName).isPresent()) {
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

    @Override
    public PageResponse<BrandResponse> getBrandsInPage(Pageable pageable) {
        Page<Brand> page = brandRepository.findAllByDeletedFalse(pageable);
        return PageResponse.from(page.map(brandMapper::toBrandResponse));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.BRANDS, allEntries = true)
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

    @Transactional
    @CacheEvict(cacheNames = CacheName.BRANDS, allEntries = true)
    public BrandResponse updateBrandById(Long id, BrandRequest brandRequest) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        String oldName = brand.getName();
        String normalizedName = brandRequest.getName().trim();
        if (brandRepository.existsByNameAndDeletedFalseAndIdNot(normalizedName, id)) {
            throw new AppException(ErrorCode.BRAND_EXISTED);
        }
        brand.setName(normalizedName);
        if (!oldName.equals(normalizedName)) {
            brand.setSlug(
                    SlugUtil.toUniqueSlug(normalizedName, slug -> brandRepository.existsBySlugAndIdNot(slug, id)));
        }
        brand.setLogoUrl(brandRequest.getLogoUrl());
        Brand savedBrand = brandRepository.save(brand);
        return brandMapper.toBrandResponse(savedBrand);
    }

    public List<BrandResponse> getDeletedBrands() {
        return brandRepository.findAllByDeletedTrue().stream()
                .map(brandMapper::toBrandResponse)
                .toList();
    }

    @Override
    public PageResponse<BrandResponse> getDeletedBrandsInPage(Pageable pageable) {
        Page<Brand> page = brandRepository.findAllByDeletedTrue(pageable);
        return PageResponse.from(page.map(brandMapper::toBrandResponse));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.BRANDS, allEntries = true)
    public BrandResponse updateBrandStatusById(@Valid BrandStatusUpdateRequest brandStatusUpdateRequest, Long id) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        brand.setActive(brandStatusUpdateRequest.getActive());
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Override
    @Cacheable(cacheNames = CacheName.BRANDS, key = "'all'")
    public List<BrandResponse> showAllBrands() {
        return brandRepository.findAllByDeletedFalseAndActiveTrue().stream()
                .map(brandMapper::toBrandResponse)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public BrandResponse showBrandById(Long id) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalseAndActiveTrue(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        return brandMapper.toBrandResponse(brand);
    }
}
