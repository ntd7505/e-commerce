package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.CouponRequest;
import com.nguyendat.ecommerce.dto.request.CouponStatusUpdateRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.entity.Coupon;
import com.nguyendat.ecommerce.enums.DiscountType;
import com.nguyendat.ecommerce.mapper.CouponMapper;
import com.nguyendat.ecommerce.repository.CouponRepository;
import com.nguyendat.ecommerce.service.CouponService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class CouponServiceImpl implements CouponService {

    CouponRepository couponRepository;
    CouponMapper couponMapper;

    @Transactional
    public CouponResponse createCoupon(CouponRequest couponRequest) {
        String normalizedCode = couponRequest.getCode().trim().toUpperCase();
        if (couponRepository.existsByCode(normalizedCode)) {
            throw new AppException(ErrorCode.COUPON_EXISTED);
        }
        validateCouponRequest(couponRequest);

        Coupon coupon = couponMapper.toCoupon(couponRequest);
        coupon.setCode(normalizedCode);

        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository
                .findCouponByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        return couponMapper.toCouponResponse(coupon);
    }

    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAllByDeletedFalse().stream()
                .map(couponMapper::toCouponResponse)
                .toList();
    }

    @Override
    public PageResponse<CouponResponse> getCouponsInPage(Pageable pageable) {
        Page<Coupon> page = couponRepository.findAllByDeletedFalse(pageable);
        return PageResponse.from(page.map(couponMapper::toCouponResponse));
    }

    public List<CouponResponse> getAllCouponDeleted() {
        return couponRepository.findAllByDeletedTrue().stream()
                .map(couponMapper::toCouponResponse)
                .toList();
    }

    @Override
    public PageResponse<CouponResponse> getDeletedCouponsInPage(Pageable pageable) {
        Page<Coupon> page = couponRepository.findAllByDeletedTrue(pageable);
        return PageResponse.from(page.map(couponMapper::toCouponResponse));
    }

    @Transactional
    public CouponResponse updateCouponById(CouponRequest couponRequest, Long id) {

        Coupon coupon = couponRepository
                .findCouponByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        validateCouponRequest(couponRequest);

        String normalizedCode = couponRequest.getCode().trim().toUpperCase();

        if (couponRepository.existsByCodeAndIdNot(normalizedCode, id)) {
            throw new AppException(ErrorCode.COUPON_EXISTED);
        }

        couponMapper.updateCoupon(coupon, couponRequest);
        coupon.setCode(normalizedCode);

        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse updateStatusCouponById(CouponStatusUpdateRequest couponStatusUpdateRequest, Long id) {
        Coupon coupon = couponRepository
                .findCouponByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        coupon.setActive(couponStatusUpdateRequest.getActive());

        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse restoreCouponById(Long id) {
        Coupon coupon = couponRepository
                .findCouponByIdAndDeletedTrue(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        coupon.setDeleted(false);
        coupon.setActive(false);
        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void deletedCouponById(Long id) {
        Coupon coupon = couponRepository
                .findCouponByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        coupon.setDeleted(true);
        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    private void validateCouponRequest(CouponRequest couponRequest) {
        if (couponRequest.getStartAt() != null
                && couponRequest.getEndAt() != null
                && !couponRequest.getEndAt().isAfter(couponRequest.getStartAt())) {
            throw new AppException(ErrorCode.COUPON_DATE_INVALID);
        }
        if (couponRequest.getDiscountType() == DiscountType.PERCENT
                && couponRequest.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new AppException(ErrorCode.COUPON_PERCENT_INVALID);
        }
    }
}

