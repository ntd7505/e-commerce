package com.nguyendat.ecommerce.service;

import java.math.BigDecimal;

import com.nguyendat.ecommerce.dto.internal.CouponCalculation;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.User;

public interface CouponApplicationService {

    CouponCalculation calculateForPreview(String couponCode, User user, BigDecimal subtotal);

    CouponCalculation calculateForOrder(String couponCode, User user, BigDecimal subtotal);

    void recordUsage(Order order, User user, CouponCalculation calculation);

    void reverseUsage(Order order);
}

