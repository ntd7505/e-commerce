package com.nguyendat.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.BrandRequest;
import com.nguyendat.ecommerce.dto.request.BrandStatusUpdateRequest;
import com.nguyendat.ecommerce.dto.response.BrandResponse;

public interface BrandService {
    BrandResponse createBrand(BrandRequest brandRequest);

    List<BrandResponse> getAllBrands();

    PageResponse<BrandResponse> getBrandsInPage(Pageable pageable);

    void deleteBrand(Long id);

    BrandResponse getBrandById(Long id);

    BrandResponse updateBrandById(Long id, BrandRequest brandRequest);

    List<BrandResponse> getDeletedBrands();

    PageResponse<BrandResponse> getDeletedBrandsInPage(Pageable pageable);

    BrandResponse updateBrandStatusById(BrandStatusUpdateRequest brandStatusUpdateRequest, Long id);

    List<BrandResponse> showAllBrands();

    BrandResponse showBrandById(Long id);
}

