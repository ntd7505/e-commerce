package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.OrderStatus;

public interface OrderStatusHistoryService {

    void record(Order order, User changedBy, OrderStatus oldStatus, OrderStatus newStatus, String note);
}
