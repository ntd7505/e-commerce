package com.NguyenDat.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.dto.request.CouponValidationRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;
import com.NguyenDat.ecommerce.dto.response.CouponValidationResponse;
import com.NguyenDat.ecommerce.entity.Coupon;
import com.NguyenDat.ecommerce.entity.CouponUsage;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.mapper.CouponMapper;
import com.NguyenDat.ecommerce.repository.CouponRepository;
import com.NguyenDat.ecommerce.repository.CouponUsageRepository;
import com.NguyenDat.ecommerce.service.ClientCouponService;
import com.NguyenDat.ecommerce.service.CouponApplicationService;
import com.NguyenDat.ecommerce.service.CurrentUserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ClientCouponServiceImpl implements ClientCouponService {

    CouponRepository couponRepository;
    CouponUsageRepository couponUsageRepository;
    CouponMapper couponMapper;
    CouponApplicationService couponApplicationService;
    CurrentUserService currentUserService;

    @Override
    public List<CouponResponse> getAvailableCoupons() {
        return couponRepository.findAvailableClientCoupons(LocalDateTime.now()).stream()
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
