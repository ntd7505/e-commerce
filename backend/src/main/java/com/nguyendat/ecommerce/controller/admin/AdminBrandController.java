package com.nguyendat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.dto.request.BrandRequest;
import com.nguyendat.ecommerce.dto.request.BrandStatusUpdateRequest;
import com.nguyendat.ecommerce.dto.request.PageRequest;
import com.nguyendat.ecommerce.dto.response.BrandResponse;
import com.nguyendat.ecommerce.service.BrandService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.BRAND_ACCESS)
public class AdminBrandController {

    BrandService brandService;

    @PostMapping("/brands")
    public ResponseEntity<ApiResponse<BrandResponse>> createBrand(@RequestBody @Valid BrandRequest brandRequest) {
        BrandResponse brandResponse = brandService.createBrand(brandRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.BRAND_CREATED, brandResponse));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<PageResponse<BrandResponse>>> getBrandsPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.BRANDS_FETCHED, brandService.getBrandsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/brands/all")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.BRANDS_FETCHED, brandService.getAllBrands()));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.BRAND_DELETED, null));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.BRAND_FETCHED, brandService.getBrandById(id)));
    }

    @GetMapping("/brands/deleted")
    public ResponseEntity<ApiResponse<PageResponse<BrandResponse>>> getDeletedBrandsPage(
            @Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.DELETED_BRANDS_FETCHED, brandService.getDeletedBrandsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/brands/deleted/all")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getDeletedBrands() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.DELETED_BRANDS_FETCHED, brandService.getDeletedBrands()));
    }

    @PatchMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrandById(
            @PathVariable Long id, @RequestBody @Valid BrandRequest brandRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.BRAND_UPDATED, brandService.updateBrandById(id, brandRequest)));
    }

    @PatchMapping("/brands/{id}/status")
    public ResponseEntity<ApiResponse<BrandResponse>> updateBrandStatusById(
            @RequestBody @Valid BrandStatusUpdateRequest brandStatusUpdateRequest, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.BRAND_STATUS_UPDATED, brandService.updateBrandStatusById(brandStatusUpdateRequest, id)));
    }
}

