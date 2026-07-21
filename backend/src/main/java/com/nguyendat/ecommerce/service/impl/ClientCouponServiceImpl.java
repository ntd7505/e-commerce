package com.nguyendat.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.dto.request.CouponValidationRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.dto.response.CouponValidationResponse;
import com.nguyendat.ecommerce.entity.Coupon;
import com.nguyendat.ecommerce.entity.CouponUsage;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.mapper.CouponMapper;
import com.nguyendat.ecommerce.repository.CouponRepository;
import com.nguyendat.ecommerce.repository.CouponUsageRepository;
import com.nguyendat.ecommerce.service.ClientCouponService;
import com.nguyendat.ecommerce.service.CouponApplicationService;
import com.nguyendat.ecommerce.service.CurrentUserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ClientCouponServiceImpl implements ClientCouponService {
    java.time.Clock clock;

    CouponRepository couponRepository;
    CouponUsageRepository couponUsageRepository;
    CouponMapper couponMapper;
    CouponApplicationService couponApplicationService;
    CurrentUserService currentUserService;

    @Override
    public List<CouponResponse> getAvailableCoupons() {
        return couponRepository.findAvailableClientCoupons(LocalDateTime.now(clock)).stream()
                .map(couponMapper::toCouponResponse)
                .toList();
    }

    @Override
    public List<CouponResponse> getMyCoupons() {
        User user = currentUserService.getCurrentUser();
        Map<Long, Coupon> coupons = new LinkedHashMap<>();
        for (CouponUsage usage : couponUsageRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())) {
            if (usage.getCoupon() != null) {
                coupons.putIfAbsent(usage.getCoupon().getId(), usage.getCoupon());
            }
        }

        return coupons.values().stream().map(couponMapper::toCouponResponse).toList();
    }

    @Override
    public CouponValidationResponse validateCoupon(CouponValidationRequest request) {
        User user = currentUserService.getCurrentUser();
        CouponCalculation calculation =
                couponApplicationService.calculateForPreview(request.getCode(), user, request.getSubtotalAmount());

        return CouponValidationResponse.builder()
                .coupon(couponMapper.toCouponResponse(calculation.coupon()))
                .discountAmount(calculation.discountAmount())
                .build();
    }
}

