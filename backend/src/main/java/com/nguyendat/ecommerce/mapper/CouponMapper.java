package com.nguyendat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.nguyendat.ecommerce.dto.request.CouponRequest;
import com.nguyendat.ecommerce.dto.response.CouponResponse;
import com.nguyendat.ecommerce.entity.Coupon;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Coupon toCoupon(CouponRequest couponRequest);

    CouponResponse toCouponResponse(Coupon coupon);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCoupon(@MappingTarget Coupon coupon, CouponRequest couponRequest);
}

