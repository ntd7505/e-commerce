package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.User;

public interface InventoryService {

    void decreaseForOrder(Order order, User changedBy);

    void restoreForOrder(Order order, User changedBy);
}

