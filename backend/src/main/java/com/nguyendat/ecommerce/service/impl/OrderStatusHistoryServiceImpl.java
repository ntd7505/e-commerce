package com.nguyendat.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderStatusHistory;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.repository.OrderStatusHistoryRepository;
import com.nguyendat.ecommerce.service.OrderStatusHistoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderStatusHistoryServiceImpl implements OrderStatusHistoryService {

    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Override
    public void record(Order order, User changedBy, OrderStatus oldStatus, OrderStatus newStatus, String note) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setChangedBy(changedBy);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNote(note);

        orderStatusHistoryRepository.save(history);
    }
}

