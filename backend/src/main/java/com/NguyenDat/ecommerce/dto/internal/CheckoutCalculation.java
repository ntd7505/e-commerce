package com.NguyenDat.ecommerce.dto.internal;

import java.math.BigDecimal;
import java.util.List;

import com.NguyenDat.ecommerce.entity.Address;
import com.NguyenDat.ecommerce.entity.Coupon;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckoutCalculation {

    List<CheckoutItem> items;
    Address address;
    Coupon coupon;

    BigDecimal subtotalAmount;
    BigDecimal shippingFee;
    BigDecimal discountAmount;
    BigDecimal totalAmount;

    Integer totalItems;
}
