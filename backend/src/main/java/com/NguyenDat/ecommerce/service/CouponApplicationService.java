package com.NguyenDat.ecommerce.service;

import java.math.BigDecimal;

import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.User;

public interface CouponApplicationService {

    CouponCalculation calculateForPreview(String couponCode, User user, BigDecimal subtotal);

    CouponCalculation calculateForOrder(String couponCode, User user, BigDecimal subtotal);

    void recordUsage(Order order, User user, CouponCalculation calculation);

    void reverseUsage(Order order);
}
