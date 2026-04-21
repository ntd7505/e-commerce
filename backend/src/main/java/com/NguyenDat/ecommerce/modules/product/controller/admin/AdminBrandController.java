package com.NguyenDat.ecommerce.modules.product.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.product.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.modules.product.service.BrandService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminBrandController {

    BrandService brandService;

    @PostMapping("/brands")
    public ApiResponse<BrandResponse> createBrand(@RequestBody @Valid BrandRequest brandRequest) {
        BrandResponse brandResponse = brandService.createBrand(brandRequest);
        return ApiResponse.of(ResponseCode.BRAND_CREATED, brandResponse);
    }

    @GetMapping("/brands")
    public ApiResponse<List<BrandResponse>> getAllBrands() {
        return ApiResponse.ofList(ResponseCode.BRANDS_FETCHED, brandService.getAllBrands());
    }

    @DeleteMapping("/brands/{id}")
    public ApiResponse<BrandResponse> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ApiResponse.of(ResponseCode.BRAND_DELETED, null);
    }

    @GetMapping("/brands/{id}")
    public ApiResponse<BrandResponse> getBrandById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.BRAND_FETCHED, brandService.getBrandById(id));
    }

    @GetMapping("/brands/deleted")
    public ApiResponse<List<BrandResponse>> getDeletedBrands() {
        return ApiResponse.ofList(ResponseCode.DELETED_BRANDS_FETCHED, brandService.getDeletedBrands());
    }

    @PutMapping("/brands/{id}")
    public ApiResponse<BrandResponse> updateBrandById(
            @PathVariable Long id, @RequestBody @Valid BrandRequest brandRequest) {
        return ApiResponse.of(ResponseCode.BRAND_UPDATED, brandService.updateBrandById(id, brandRequest));
    }
}
