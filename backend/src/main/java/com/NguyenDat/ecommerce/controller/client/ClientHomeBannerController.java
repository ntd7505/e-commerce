package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.HomeBannerResponse;
import com.NguyenDat.ecommerce.service.HomeBannerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX + "/home-banners")
public class ClientHomeBannerController {

    HomeBannerService homeBannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeBannerResponse>>> getActiveBanners() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.HOME_BANNERS_FETCHED, homeBannerService.getActiveClientBanners()));
    }
}
