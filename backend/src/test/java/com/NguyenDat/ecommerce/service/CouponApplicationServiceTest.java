package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.entity.Coupon;
import com.NguyenDat.ecommerce.entity.CouponUsage;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.CouponUsageStatus;
import com.NguyenDat.ecommerce.enums.DiscountType;
import com.NguyenDat.ecommerce.repository.CouponRepository;
import com.NguyenDat.ecommerce.repository.CouponUsageRepository;
import com.NguyenDat.ecommerce.service.impl.CouponApplicationServiceImpl;

@ExtendWith(MockitoExtension.class)
class CouponApplicationServiceTest {

    @Mock
    CouponUsageRepository couponUsageRepository;

    @Mock
    CouponRepository couponRepository;

    @InjectMocks
    CouponApplicationServiceImpl couponApplicationService;

    Coupon coupon;
    User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();

        coupon = new Coupon();
        coupon.setId(10L);
        coupon.setCode("SALE10");
        coupon.setDiscountType(DiscountType.PERCENT);
        coupon.setDiscountValue(BigDecimal.TEN);
        coupon.setMaxDiscountAmount(BigDecimal.valueOf(50_000));
        coupon.setUsedCount(0);
        coupon.setActive(true);
    }

    @Test
    void calculateForPreview_shouldNormalizeCodeAndLimitMaximumDiscount() {
        when(couponRepository.findByCodeAndDeletedFalseAndActiveTrue("SALE10")).thenReturn(Optional.of(coupon));

        CouponCalculation result =
                couponApplicationService.calculateForPreview(" sale10 ", user, BigDecimal.valueOf(1_000_000));

        assertEquals(BigDecimal.valueOf(50_000), result.discountAmount());
        verify(couponRepository).findByCodeAndDeletedFalseAndActiveTrue("SALE10");
        verify(couponRepository, never()).findActiveCouponByCodeForUpdate(any());
    }

    @Test
    void calculateForOrder_shouldUseLockedCouponQuery() {
        when(couponRepository.findActiveCouponByCodeForUpdate("SALE10")).thenReturn(Optional.of(coupon));

        couponApplicationService.calculateForOrder("sale10", user, BigDecimal.valueOf(100_000));

        verify(couponRepository).findActiveCouponByCodeForUpdate("SALE10");
    }

    @Test
    void calculateForPreview_shouldRejectExpiredCoupon() {
        coupon.setEndAt(LocalDateTime.now().minusMinutes(1));
        when(couponRepository.findByCodeAndDeletedFalseAndActiveTrue("SALE10")).thenReturn(Optional.of(coupon));

        AppException exception = assertThrows(
                AppException.class,
                () -> couponApplicationService.calculateForPreview("SALE10", user, BigDecimal.valueOf(100_000)));

        assertEquals(ErrorCode.COUPON_EXPIRED, exception.getErrorCode());
    }

    @Test
    void calculateForPreview_shouldRejectPerUserLimit() {
        coupon.setPerUserLimit(1);
        when(couponRepository.findByCodeAndDeletedFalseAndActiveTrue("SALE10")).thenReturn(Optional.of(coupon));
        when(couponUsageRepository.countByCouponIdAndUserIdAndStatus(10L, 1L, CouponUsageStatus.USED))
                .thenReturn(1L);

        AppException exception = assertThrows(
                AppException.class,
                () -> couponApplicationService.calculateForPreview("SALE10", user, BigDecimal.valueOf(100_000)));

        assertEquals(ErrorCode.COUPON_PER_USER_LIMIT_REACHED, exception.getErrorCode());
    }

    @Test
    void recordUsage_shouldIncreaseUsedCountAndSaveUsage() {
        Order order = new Order();
        order.setId(100L);
        CouponCalculation calculation = new CouponCalculation(coupon, BigDecimal.valueOf(10_000));

        couponApplicationService.recordUsage(order, user, calculation);

        assertEquals(1, coupon.getUsedCount());
        ArgumentCaptor<CouponUsage> captor = ArgumentCaptor.forClass(CouponUsage.class);
        verify(couponUsageRepository).save(captor.capture());
        assertEquals(CouponUsageStatus.USED, captor.getValue().getStatus());
        assertEquals(order, captor.getValue().getOrder());
        assertEquals(BigDecimal.valueOf(10_000), captor.getValue().getDiscountAmount());
    }

    @Test
    void reverseUsage_shouldDecreaseCountAndMarkReversed() {
        Order order = new Order();
        order.setId(100L);
        order.setCoupon(coupon);
        coupon.setUsedCount(1);

        CouponUsage usage = new CouponUsage();
        usage.setCoupon(coupon);
        usage.setStatus(CouponUsageStatus.USED);

        when(couponUsageRepository.findByOrderIdForUpdate(100L)).thenReturn(Optional.of(usage));
        when(couponRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(coupon));

        couponApplicationService.reverseUsage(order);

        assertEquals(0, coupon.getUsedCount());
        assertEquals(CouponUsageStatus.REVERSED, usage.getStatus());
        assertNotNull(usage.getReversedAt());
    }
}
