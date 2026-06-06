package com.NguyenDat.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.OrderStatusHistory;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.repository.OrderStatusHistoryRepository;
import com.NguyenDat.ecommerce.service.OrderStatusHistoryService;

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
