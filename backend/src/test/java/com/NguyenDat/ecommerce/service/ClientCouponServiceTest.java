package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
import com.NguyenDat.ecommerce.service.impl.ClientCouponServiceImpl;

@ExtendWith(MockitoExtension.class)
class ClientCouponServiceTest {

    @Mock
    CouponRepository couponRepository;

    @Mock
    CouponUsageRepository couponUsageRepository;

    @Mock
    CouponMapper couponMapper;

    @Mock
    CouponApplicationService couponApplicationService;

    @Mock
    CurrentUserService currentUserService;

    @InjectMocks
    ClientCouponServiceImpl clientCouponService;

    @Test
    void getAvailableCoupons_shouldMapAvailableCoupons() {
        Coupon coupon = coupon(1L);
        CouponResponse response = CouponResponse.builder().id(1L).code("SALE10").build();
        when(couponRepository.findAvailableClientCoupons(any(LocalDateTime.class))).thenReturn(List.of(coupon));
        when(couponMapper.toCouponResponse(coupon)).thenReturn(response);

        assertEquals(List.of(response), clientCouponService.getAvailableCoupons());
    }

    @Test
    void getMyCoupons_shouldMapDistinctCouponsFromUsageHistory() {
        User user = User.builder().id(1L).build();
        Coupon coupon = coupon(1L);
        CouponUsage first = new CouponUsage();
        first.setCoupon(coupon);
        CouponUsage duplicate = new CouponUsage();
        duplicate.setCoupon(coupon);
        CouponResponse response = CouponResponse.builder().id(1L).code("SALE10").build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(couponUsageRepository.findAllByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(first, duplicate));
        when(couponMapper.toCouponResponse(coupon)).thenReturn(response);

        assertEquals(List.of(response), clientCouponService.getMyCoupons());
        verify(couponMapper, times(1)).toCouponResponse(coupon);
    }

    @Test
    void validateCoupon_shouldDelegatePreviewCalculationWithoutRecordingUsage() {
        User user = User.builder().id(1L).build();
        Coupon coupon = coupon(1L);
        CouponResponse couponResponse = CouponResponse.builder().id(1L).code("SALE10").build();
        CouponValidationRequest request = CouponValidationRequest.builder()
                .code("sale10")
                .subtotalAmount(BigDecimal.valueOf(500_000))
                .build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(couponApplicationService.calculateForPreview("sale10", user, BigDecimal.valueOf(500_000)))
                .thenReturn(new CouponCalculation(coupon, BigDecimal.valueOf(50_000)));
        when(couponMapper.toCouponResponse(coupon)).thenReturn(couponResponse);

        CouponValidationResponse result = clientCouponService.validateCoupon(request);

        assertEquals(couponResponse, result.getCoupon());
        assertEquals(BigDecimal.valueOf(50_000), result.getDiscountAmount());
        verify(couponApplicationService, never()).recordUsage(any(), any(), any());
    }

    private Coupon coupon(Long id) {
        Coupon coupon = new Coupon();
        coupon.setId(id);
        coupon.setCode("SALE10");
        return coupon;
    }
}
