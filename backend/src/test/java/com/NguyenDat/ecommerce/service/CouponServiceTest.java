package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.CouponRequest;
import com.NguyenDat.ecommerce.dto.response.CouponResponse;
import com.NguyenDat.ecommerce.entity.Coupon;
import com.NguyenDat.ecommerce.enums.DiscountType;
import com.NguyenDat.ecommerce.mapper.CouponMapper;
import com.NguyenDat.ecommerce.repository.CouponRepository;
import com.NguyenDat.ecommerce.service.impl.CouponServiceImpl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class CouponServiceTest {

    @Mock
    CouponRepository couponRepository;

    @Mock
    CouponMapper couponMapper;

    @InjectMocks
    CouponServiceImpl couponService;

    CouponRequest couponRequest;
    Coupon coupon;
    CouponResponse couponResponse;

    @BeforeEach
    void setUp() {
        couponRequest = CouponRequest.builder()
                .code(" sale10 ")
                .name("Sale 10 percent")
                .description("Discount 10 percent")
                .discountType(DiscountType.PERCENT)
                .discountValue(BigDecimal.valueOf(10))
                .minOrderAmount(BigDecimal.valueOf(500000))
                .maxDiscountAmount(BigDecimal.valueOf(100000))
                .usageLimit(100)
                .perUserLimit(1)
                .startAt(LocalDateTime.of(2026, 5, 5, 0, 0))
                .endAt(LocalDateTime.of(2026, 5, 31, 23, 59))
                .build();

        coupon = new Coupon();
        coupon.setId(1L);
        coupon.setCode("SALE10");
        coupon.setName("Sale 10 percent");
        coupon.setDescription("Discount 10 percent");
        coupon.setDiscountType(DiscountType.PERCENT);
        coupon.setDiscountValue(BigDecimal.valueOf(10));
        coupon.setMinOrderAmount(BigDecimal.valueOf(500000));
        coupon.setMaxDiscountAmount(BigDecimal.valueOf(100000));
        coupon.setUsageLimit(100);
        coupon.setUsedCount(0);
        coupon.setPerUserLimit(1);
        coupon.setActive(true);
        coupon.setDeleted(false);

        couponResponse = CouponResponse.builder()
                .id(1L)
                .code("SALE10")
                .name("Sale 10 percent")
                .discountType(DiscountType.PERCENT)
                .discountValue(BigDecimal.valueOf(10))
                .active(true)
                .deleted(false)
                .build();
    }

    @Test
    void createCoupon_shouldReturnCouponResponse_whenRequestIsValid() {
        when(couponRepository.existsByCode("SALE10")).thenReturn(false);
        when(couponMapper.toCoupon(couponRequest)).thenReturn(coupon);
        when(couponRepository.save(coupon)).thenReturn(coupon);
        when(couponMapper.toCouponResponse(coupon)).thenReturn(couponResponse);

        CouponResponse result = couponService.createCoupon(couponRequest);

        assertEquals(1L, result.getId());
        assertEquals("SALE10", result.getCode());
        assertEquals("SALE10", coupon.getCode());
        verify(couponRepository).existsByCode("SALE10");
        verify(couponRepository).save(coupon);
    }

    @Test
    void createCoupon_shouldThrowException_whenCouponCodeAlreadyExists() {
        when(couponRepository.existsByCode("SALE10")).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> couponService.createCoupon(couponRequest));

        assertEquals(ErrorCode.COUPON_EXISTED, exception.getErrorCode());
        verify(couponRepository, never()).save(any());
    }

    @Test
    void createCoupon_shouldThrowException_whenDateRangeIsInvalid() {
        couponRequest.setStartAt(LocalDateTime.of(2026, 5, 31, 0, 0));
        couponRequest.setEndAt(LocalDateTime.of(2026, 5, 5, 0, 0));
        when(couponRepository.existsByCode("SALE10")).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> couponService.createCoupon(couponRequest));

        assertEquals(ErrorCode.COUPON_DATE_INVALID, exception.getErrorCode());
        verify(couponRepository, never()).save(any());
    }

    @Test
    void createCoupon_shouldThrowException_whenPercentIsGreaterThan100() {
        couponRequest.setDiscountValue(BigDecimal.valueOf(101));
        when(couponRepository.existsByCode("SALE10")).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> couponService.createCoupon(couponRequest));

        assertEquals(ErrorCode.COUPON_PERCENT_INVALID, exception.getErrorCode());
        verify(couponRepository, never()).save(any());
    }

    @Test
    void getCouponById_shouldReturnCouponResponse_whenCouponExists() {
        when(couponRepository.findCouponByIdAndDeletedFalse(1L)).thenReturn(Optional.of(coupon));
        when(couponMapper.toCouponResponse(coupon)).thenReturn(couponResponse);

        CouponResponse result = couponService.getCouponById(1L);

        assertEquals(1L, result.getId());
        assertEquals("SALE10", result.getCode());
        verify(couponRepository).findCouponByIdAndDeletedFalse(1L);
    }

    @Test
    void getCouponById_shouldThrowException_whenCouponNotFound() {
        when(couponRepository.findCouponByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> couponService.getCouponById(1L));

        assertEquals(ErrorCode.COUPON_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getAllCoupons_shouldReturnRepositoryResults() {
        when(couponRepository.findAllByDeletedFalse()).thenReturn(List.of(coupon));
        when(couponMapper.toCouponResponse(coupon)).thenReturn(couponResponse);

        List<CouponResponse> result = couponService.getAllCoupons();

        assertEquals(1, result.size());
        assertEquals("SALE10", result.getFirst().getCode());
        verify(couponRepository).findAllByDeletedFalse();
    }

    @Test
    void updateCouponById_shouldReturnCouponResponse_whenRequestIsValid() {
        when(couponRepository.findCouponByIdAndDeletedFalse(1L)).thenReturn(Optional.of(coupon));
        when(couponRepository.existsByCodeAndIdNot("SALE10", 1L)).thenReturn(false);
        when(couponRepository.save(coupon)).thenReturn(coupon);
        when(couponMapper.toCouponResponse(coupon)).thenReturn(couponResponse);

        CouponResponse result = couponService.updateCouponById(couponRequest, 1L);

        assertEquals("SALE10", result.getCode());
        assertEquals("SALE10", coupon.getCode());
        verify(couponMapper).updateCoupon(coupon, couponRequest);
        verify(couponRepository).save(coupon);
    }

    @Test
    void updateCouponById_shouldThrowException_whenCouponNotFound() {
        when(couponRepository.findCouponByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> couponService.updateCouponById(couponRequest, 1L));

        assertEquals(ErrorCode.COUPON_NOT_FOUND, exception.getErrorCode());
        verify(couponRepository, never()).save(any());
    }

    @Test
    void deleteCouponById_shouldMarkCouponAsDeleted_whenCouponExists() {
        when(couponRepository.findCouponByIdAndDeletedFalse(1L)).thenReturn(Optional.of(coupon));
        when(couponRepository.save(coupon)).thenReturn(coupon);

        couponService.deletedCouponById(1L);

        assertTrue(coupon.isDeleted());
        assertFalse(coupon.isActive());
        verify(couponRepository).save(coupon);
    }
}
