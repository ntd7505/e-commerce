package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderStatusHistory;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.repository.OrderStatusHistoryRepository;
import com.nguyendat.ecommerce.service.impl.OrderStatusHistoryServiceImpl;

@ExtendWith(MockitoExtension.class)
class OrderStatusHistoryServiceTest {

    @Mock
    OrderStatusHistoryRepository orderStatusHistoryRepository;

    @InjectMocks
    OrderStatusHistoryServiceImpl orderStatusHistoryService;

    @Test
    void record_shouldSaveStatusTransitionDetails() {
        Order order = new Order();
        User changedBy = User.builder().id(1L).build();

        orderStatusHistoryService.record(order, changedBy, OrderStatus.PENDING, OrderStatus.CONFIRMED, "Confirmed");

        ArgumentCaptor<OrderStatusHistory> captor = ArgumentCaptor.forClass(OrderStatusHistory.class);
        verify(orderStatusHistoryRepository).save(captor.capture());
        OrderStatusHistory history = captor.getValue();
        assertEquals(order, history.getOrder());
        assertEquals(changedBy, history.getChangedBy());
        assertEquals(OrderStatus.PENDING, history.getOldStatus());
        assertEquals(OrderStatus.CONFIRMED, history.getNewStatus());
        assertEquals("Confirmed", history.getNote());
    }
}

