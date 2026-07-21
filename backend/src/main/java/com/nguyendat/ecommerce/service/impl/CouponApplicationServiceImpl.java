package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.entity.Coupon;
import com.nguyendat.ecommerce.entity.CouponUsage;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.CouponUsageStatus;
import com.nguyendat.ecommerce.enums.DiscountType;
import com.nguyendat.ecommerce.repository.CouponRepository;
import com.nguyendat.ecommerce.repository.CouponUsageRepository;
import com.nguyendat.ecommerce.service.CouponApplicationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponApplicationServiceImpl implements CouponApplicationService {
    java.time.Clock clock;

    CouponUsageRepository couponUsageRepository;
    CouponRepository couponRepository;

    @Override
    @Transactional(readOnly = true)
    public CouponCalculation calculateForPreview(String couponCode, User user, BigDecimal subtotal) {
        String normalizedCode = couponCode.trim().toUpperCase();
        Coupon coupon = couponRepository
                .findByCodeAndDeletedFalseAndActiveTrue(normalizedCode)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        return validateAndCalculate(coupon, user, subtotal);
    }

    @Override
    @Transactional
    public CouponCalculation calculateForOrder(String couponCode, User user, BigDecimal subtotal) {
        String normalizedCode = couponCode.trim().toUpperCase();
        Coupon coupon = couponRepository
                .findActiveCouponByCodeForUpdate(normalizedCode)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        return validateAndCalculate(coupon, user, subtotal);
    }

    @Override
    @Transactional
    public void recordUsage(Order order, User user, CouponCalculation calculation) {
        if (!calculation.hasCoupon()) {
            return;
        }

        if (couponUsageRepository.existsByOrderId(order.getId())) {
            throw new IllegalStateException("Coupon usage already recorded for order");
        }

        Coupon coupon = calculation.coupon();
        coupon.setUsedCount(coupon.getUsedCount() + 1);

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setUser(user);
        usage.setOrder(order);
        usage.setDiscountAmount(calculation.discountAmount());
        usage.setStatus(CouponUsageStatus.USED);
        usage.setUsedAt(LocalDateTime.now(clock));

        couponUsageRepository.save(usage);
    }

    @Override
    @Transactional
    public void reverseUsage(Order order) {
        if (order.getCoupon() == null) {
            return;
        }

        CouponUsage usage = couponUsageRepository
                .findByOrderIdForUpdate(order.getId())
                .orElseThrow(() -> new IllegalStateException("Coupon usage not found"));

        if (usage.getStatus() == CouponUsageStatus.REVERSED) {
            return;
        }

        Coupon coupon = couponRepository
                .findByIdForUpdate(usage.getCoupon().getId())
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        if (coupon.getUsedCount() <= 0) {
            throw new IllegalStateException("Coupon usedCount cannot be less than zero");
        }

        coupon.setUsedCount(coupon.getUsedCount() - 1);
        usage.setStatus(CouponUsageStatus.REVERSED);
        usage.setReversedAt(LocalDateTime.now(clock));
    }

    private CouponCalculation validateAndCalculate(Coupon coupon, User user, BigDecimal subtotal) {

        LocalDateTime now = LocalDateTime.now(clock);

        // Check the start and end dates of the coupon code
        if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
            throw new AppException(ErrorCode.COUPON_NOT_STARTED);
        }

        if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
            throw new AppException(ErrorCode.COUPON_EXPIRED);
        }

        // Check the minimum order value against the coupon code
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new AppException(ErrorCode.COUPON_MIN_ORDER_AMOUNT_NOT_REACHED);
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new AppException(ErrorCode.COUPON_USAGE_LIMIT_REACHED);
        }

        validatePerUserLimit(coupon, user);

        return new CouponCalculation(coupon, calculateDiscount(coupon, subtotal));
    }

    private void validatePerUserLimit(Coupon coupon, User user) {
        if (coupon.getPerUserLimit() == null) {
            return;
        }

        long usedCount = couponUsageRepository.countByCouponIdAndUserIdAndStatus(
                coupon.getId(), user.getId(), CouponUsageStatus.USED);

        if (usedCount >= coupon.getPerUserLimit()) {
            throw new AppException(ErrorCode.COUPON_PER_USER_LIMIT_REACHED);
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;

        if (coupon.getDiscountType() == DiscountType.PERCENT) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = coupon.getDiscountValue();
        }

        if (coupon.getMaxDiscountAmount() != null) {
            discount = discount.min(coupon.getMaxDiscountAmount());
        }

        return discount.min(subtotal);
    }
}

