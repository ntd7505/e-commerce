package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.User;

public interface OrderCreationService {

    Order create(User user, CheckoutRequest request, CheckoutCalculation checkout);
}

