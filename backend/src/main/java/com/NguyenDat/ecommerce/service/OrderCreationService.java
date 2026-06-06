package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.User;

public interface OrderCreationService {

    Order create(User user, CheckoutRequest request, CheckoutCalculation checkout);
}
