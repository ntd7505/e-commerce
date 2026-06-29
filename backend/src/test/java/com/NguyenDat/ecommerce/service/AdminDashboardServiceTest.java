package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.SliceImpl;

import com.NguyenDat.ecommerce.dto.response.AdminDashboardResponse;
import com.NguyenDat.ecommerce.dto.response.AdminTopProductResponse;
import com.NguyenDat.ecommerce.dto.response.OrderResponse;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.mapper.OrderMapper;
import com.NguyenDat.ecommerce.repository.OrderItemRepository;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.repository.ProductRepository;
import com.NguyenDat.ecommerce.repository.ProductReviewRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.impl.AdminDashboardServiceImpl;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock
    OrderRepository orderRepository;

    @Mock
    OrderItemRepository orderItemRepository;

    @Mock
    ProductRepository productRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    ProductReviewRepository productReviewRepository;

    @Mock
    OrderMapper orderMapper;

    @InjectMocks
    AdminDashboardServiceImpl adminDashboardService;

    @Test
    void getDashboard_shouldAggregateDashboardStats() {
        Order order = new Order();
        OrderResponse orderResponse = OrderResponse.builder().id(1L).build();
        AdminTopProductResponse topProduct = AdminTopProductResponse.builder()
                .productId(10L)
                .productName("iPhone")
                .quantitySold(5L)
                .revenue(BigDecimal.valueOf(500))
                .build();

        when(orderRepository.count()).thenReturn(10L);
        when(orderRepository.countByStatus(OrderStatus.PENDING)).thenReturn(2L);
        when(orderRepository.countByStatus(OrderStatus.COMPLETED)).thenReturn(6L);
        when(orderRepository.countByStatus(OrderStatus.CANCELLED)).thenReturn(1L);
        when(orderRepository.sumRevenueForSuccessfulOrders()).thenReturn(BigDecimal.valueOf(1_000));
        when(productRepository.countByDeletedFalse()).thenReturn(20L);
        when(productRepository.countByDeletedFalseAndActiveTrue()).thenReturn(18L);
        when(userRepository.countByDeletedFalse()).thenReturn(30L);
        when(productReviewRepository.countByDeletedFalse()).thenReturn(40L);
        when(productReviewRepository.averageRatingForActiveReviews()).thenReturn(4.5D);
        when(orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5)))
                .thenReturn(new SliceImpl<>(List.of(order)));
        when(orderMapper.toOrderResponse(order)).thenReturn(orderResponse);
        when(orderItemRepository.findTopProductsByQuantitySold(PageRequest.of(0, 5)))
                .thenReturn(List.of(topProduct));

        AdminDashboardResponse result = adminDashboardService.getDashboard();

        assertEquals(10L, result.getTotalOrders());
        assertEquals(2L, result.getPendingOrders());
        assertEquals(6L, result.getCompletedOrders());
        assertEquals(BigDecimal.valueOf(1_000), result.getTotalRevenue());
        assertEquals(18L, result.getActiveProducts());
        assertEquals(30L, result.getTotalCustomers());
        assertEquals(4.5D, result.getAverageRating());
        assertEquals(List.of(orderResponse), result.getRecentOrders());
        assertEquals(List.of(topProduct), result.getTopProducts());
    }
}
