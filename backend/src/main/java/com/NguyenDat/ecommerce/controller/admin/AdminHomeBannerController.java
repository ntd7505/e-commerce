package com.NguyenDat.ecommerce.controller.admin;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.HomeBannerRequest;
import com.NguyenDat.ecommerce.dto.request.HomeBannerStatusRequest;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
import com.NguyenDat.ecommerce.dto.request.ReorderBannersRequest;
import com.NguyenDat.ecommerce.dto.response.HomeBannerResponse;
import com.NguyenDat.ecommerce.enums.BannerPosition;
import com.NguyenDat.ecommerce.service.HomeBannerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX + "/home-banners")
// @PreAuthorize("hasRole('ADMIN')") // Adjust permission as needed, assuming ADMIN for now
public class AdminHomeBannerController {

    HomeBannerService homeBannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<HomeBannerResponse>>> getBanners(
            @RequestParam(required = false) BannerPosition position,
            @RequestParam(required = false) Boolean active,
            @Valid PageRequest pageRequest) {
        PageResponse<HomeBannerResponse> response = PageResponse.from(
                homeBannerService.getAdminBanners(position, active, pageRequest.toPageable()));
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_BANNERS_FETCHED, response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HomeBannerResponse>> createBanner(@RequestBody @Valid HomeBannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.HOME_BANNER_CREATED, homeBannerService.createBanner(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeBannerResponse>> getBanner(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_BANNER_FETCHED, homeBannerService.getBannerById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeBannerResponse>> updateBanner(
            @PathVariable Long id, @RequestBody @Valid HomeBannerRequest request) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_BANNER_UPDATED, homeBannerService.updateBanner(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<HomeBannerResponse>> updateBannerStatus(
            @PathVariable Long id, @RequestBody @Valid HomeBannerStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_BANNER_STATUS_UPDATED, homeBannerService.updateBannerStatus(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
        homeBannerService.deleteBanner(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_BANNER_DELETED, null));
    }

    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderHeroBanners(@RequestBody @Valid ReorderBannersRequest request) {
        homeBannerService.reorderHeroBanners(request);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.HOME_HERO_BANNERS_REORDERED, null));
    }
}
