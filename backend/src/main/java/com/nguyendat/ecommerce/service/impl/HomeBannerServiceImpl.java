package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.common.util.MediaUtils;
import com.nguyendat.ecommerce.dto.request.HomeBannerRequest;
import com.nguyendat.ecommerce.dto.request.HomeBannerStatusRequest;
import com.nguyendat.ecommerce.dto.request.ReorderBannersRequest;
import com.nguyendat.ecommerce.dto.response.HomeBannerResponse;
import com.nguyendat.ecommerce.dto.response.ProductSummaryResponse;
import com.nguyendat.ecommerce.entity.HomeBanner;
import com.nguyendat.ecommerce.entity.Product;
import com.nguyendat.ecommerce.enums.BannerPosition;
import com.nguyendat.ecommerce.repository.HomeBannerRepository;
import com.nguyendat.ecommerce.repository.ProductRepository;
import com.nguyendat.ecommerce.service.HomeBannerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeBannerServiceImpl implements HomeBannerService {
    java.time.Clock clock;

    HomeBannerRepository homeBannerRepository;
    ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<HomeBannerResponse> getAdminBanners(BannerPosition position, Boolean active, Pageable pageable) {
        return homeBannerRepository.findAdminBanners(position, active, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeBannerResponse> getActiveClientBanners() {
        List<HomeBanner> banners = homeBannerRepository.findActiveClientBanners(LocalDateTime.now(clock));
        List<HomeBannerResponse> responses = new java.util.ArrayList<>();
        boolean hasHero = false;

        for (HomeBanner banner : banners) {
            if (banner.getPosition() == BannerPosition.HOME_HERO) {
                if (hasHero) continue;
                hasHero = true;
            }
            responses.add(mapToResponse(banner));
        }

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public HomeBannerResponse getBannerById(Long id) {
        HomeBanner banner = getBannerEntity(id);
        return mapToResponse(banner);
    }

    @Override
    @Transactional
    public HomeBannerResponse createBanner(HomeBannerRequest request) {
        validateBannerRequest(request);

        Product product = getProductEntity(request.getProductId());
        int sortOrder = homeBannerRepository.getMaxSortOrderByPosition(request.getPosition()) + 1;

        HomeBanner banner = HomeBanner.builder()
                .product(product)
                .position(request.getPosition())
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .imageUrl(request.getImageUrl())
                .mobileImageUrl(request.getMobileImageUrl())
                .backgroundColor(request.getBackgroundColor())
                .sortOrder(sortOrder)
                .isActive(request.isActive())
                .startsAt(request.getStartsAt())
                .endsAt(request.getEndsAt())
                .build();

        handleExclusiveActivePosition(banner);
        HomeBanner savedBanner = homeBannerRepository.save(banner);
        return mapToResponse(savedBanner);
    }

    @Override
    @Transactional
    public HomeBannerResponse updateBanner(Long id, HomeBannerRequest request) {
        validateBannerRequest(request);

        HomeBanner banner = getBannerEntity(id);
        Product product = getProductEntity(request.getProductId());

        banner.setProduct(product);
        banner.setPosition(request.getPosition());
        banner.setTitle(request.getTitle());
        banner.setSubtitle(request.getSubtitle());
        banner.setImageUrl(request.getImageUrl());
        banner.setMobileImageUrl(request.getMobileImageUrl());
        banner.setBackgroundColor(request.getBackgroundColor());
        banner.setActive(request.isActive());
        banner.setStartsAt(request.getStartsAt());
        banner.setEndsAt(request.getEndsAt());

        handleExclusiveActivePosition(banner);
        HomeBanner savedBanner = homeBannerRepository.save(banner);
        return mapToResponse(savedBanner);
    }

    @Override
    @Transactional
    public HomeBannerResponse updateBannerStatus(Long id, HomeBannerStatusRequest request) {
        HomeBanner banner = getBannerEntity(id);
        banner.setActive(request.getActive());

        handleExclusiveActivePosition(banner);
        HomeBanner savedBanner = homeBannerRepository.save(banner);
        return mapToResponse(savedBanner);
    }

    @Override
    @Transactional
    public void deleteBanner(Long id) {
        HomeBanner banner = getBannerEntity(id);
        banner.setDeleted(true);
        homeBannerRepository.save(banner);
    }

    @Override
    @Transactional
    public void reorderHeroBanners(ReorderBannersRequest request) {
        List<Long> bannerIds = request.getBannerIds();
        for (int i = 0; i < bannerIds.size(); i++) {
            Long id = bannerIds.get(i);
            HomeBanner banner = getBannerEntity(id);
            if (banner.getPosition() != BannerPosition.HOME_HERO) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
            banner.setSortOrder(i);
            homeBannerRepository.save(banner);
        }
    }

    private void validateBannerRequest(HomeBannerRequest request) {
        if (request.getStartsAt() != null && request.getEndsAt() != null) {
            if (request.getEndsAt().isBefore(request.getStartsAt())) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        }
        if (request.getBackgroundColor() != null
                && !request.getBackgroundColor().isEmpty()) {
            if (!request.getBackgroundColor().matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
                throw new AppException(ErrorCode.INVALID_KEY);
            }
        }
    }

    private void handleExclusiveActivePosition(HomeBanner banner) {
        if (!banner.isActive()) return;

        List<HomeBanner> activeBanners =
                homeBannerRepository.findByPositionAndIsActiveTrueAndDeletedFalse(banner.getPosition());
        for (HomeBanner activeBanner : activeBanners) {
            if (!activeBanner.getId().equals(banner.getId())) {
                activeBanner.setActive(false);
                homeBannerRepository.save(activeBanner);
            }
        }
    }

    private HomeBanner getBannerEntity(Long id) {
        return homeBannerRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOME_BANNER_NOT_FOUND));
    }

    private Product getProductEntity(Long productId) {
        Product product =
                productRepository.findById(productId).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.isActive() || product.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_INACTIVE);
        }
        return product;
    }

    private HomeBannerResponse mapToResponse(HomeBanner banner) {
        Product product = banner.getProduct();

        BigDecimal price = BigDecimal.ZERO;
        BigDecimal salePrice = BigDecimal.ZERO;

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            price = BigDecimal.valueOf(product.getVariants().get(0).getPrice());
            salePrice = BigDecimal.valueOf(product.getVariants().get(0).getSalePrice());
        }

        List<String> imageUrls = null;
        if (product.getMedia() != null) {
            imageUrls = product.getMedia().stream()
                    .filter(m -> m.isActive() && !m.isDeleted() && "IMAGE".equalsIgnoreCase(m.getMediaType()))
                    .sorted(java.util.Comparator.comparingInt(
                            com.nguyendat.ecommerce.entity.ProductMedia::getSortOrder))
                    .map(com.nguyendat.ecommerce.entity.ProductMedia::getUrl)
                    .distinct()
                    .collect(Collectors.toList());
        }

        ProductSummaryResponse productSummary = ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .thumbnailUrl(MediaUtils.resolveThumbnailUrl(product.getMedia()))
                .imageUrls(imageUrls)
                .price(price)
                .salePrice(salePrice)
                .build();

        return HomeBannerResponse.builder()
                .id(banner.getId())
                .position(banner.getPosition())
                .title(banner.getTitle())
                .subtitle(banner.getSubtitle())
                .imageUrl(banner.getImageUrl())
                .mobileImageUrl(banner.getMobileImageUrl())
                .backgroundColor(banner.getBackgroundColor())
                .sortOrder(banner.getSortOrder())
                .active(banner.isActive())
                .startsAt(banner.getStartsAt())
                .endsAt(banner.getEndsAt())
                .product(productSummary)
                .build();
    }
}

