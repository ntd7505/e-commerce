package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.OrderStatus;

public interface OrderStatusHistoryService {

    void record(Order order, User changedBy, OrderStatus oldStatus, OrderStatus newStatus, String note);
}

