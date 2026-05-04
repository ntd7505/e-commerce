package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.dto.request.BrandStatusUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.BrandResponse;

public interface BrandService {
    BrandResponse createBrand(BrandRequest brandRequest);

    List<BrandResponse> getAllBrands();

    void deleteBrand(Long id);

    BrandResponse getBrandById(Long id);

    BrandResponse updateBrandById(Long id, BrandRequest brandRequest);

    List<BrandResponse> getDeletedBrands();

    BrandResponse updateBrandStatusById(BrandStatusUpdateRequest brandStatusUpdateRequest, Long id);
}
