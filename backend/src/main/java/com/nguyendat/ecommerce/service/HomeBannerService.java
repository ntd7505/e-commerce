package com.nguyendat.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyendat.ecommerce.dto.request.HomeBannerRequest;
import com.nguyendat.ecommerce.dto.request.HomeBannerStatusRequest;
import com.nguyendat.ecommerce.dto.request.ReorderBannersRequest;
import com.nguyendat.ecommerce.dto.response.HomeBannerResponse;
import com.nguyendat.ecommerce.enums.BannerPosition;

public interface HomeBannerService {
    Page<HomeBannerResponse> getAdminBanners(BannerPosition position, Boolean active, Pageable pageable);

    List<HomeBannerResponse> getActiveClientBanners();

    HomeBannerResponse getBannerById(Long id);

    HomeBannerResponse createBanner(HomeBannerRequest request);

    HomeBannerResponse updateBanner(Long id, HomeBannerRequest request);

    HomeBannerResponse updateBannerStatus(Long id, HomeBannerStatusRequest request);

    void deleteBanner(Long id);

    void reorderHeroBanners(ReorderBannersRequest request);
}

