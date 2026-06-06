package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.User;

public interface InventoryService {

    void decreaseForOrder(Order order, User changedBy);

    void restoreForOrder(Order order, User changedBy);
}
