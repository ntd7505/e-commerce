package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.service.BrandService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientBrandController {

    BrandService brandService;

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> showAllBrands() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.BRANDS_FETCHED, brandService.showAllBrands()));
    }

    @GetMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> showBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.BRAND_FETCHED, brandService.showBrandById(id)));
    }
}
