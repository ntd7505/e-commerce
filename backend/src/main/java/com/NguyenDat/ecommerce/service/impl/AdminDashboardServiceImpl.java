package com.NguyenDat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.dto.response.AdminDashboardResponse;
import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.mapper.OrderMapper;
import com.NguyenDat.ecommerce.repository.OrderItemRepository;
import com.NguyenDat.ecommerce.repository.OrderRepository;
import com.NguyenDat.ecommerce.repository.ProductRepository;
import com.NguyenDat.ecommerce.repository.ProductReviewRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.AdminDashboardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    OrderRepository orderRepository;
    OrderItemRepository orderItemRepository;
    ProductRepository productRepository;
    UserRepository userRepository;
    ProductReviewRepository productReviewRepository;
    OrderMapper orderMapper;

    @Override
    public AdminDashboardResponse getDashboard() {
        return AdminDashboardResponse.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED))
                .totalRevenue(defaultZero(orderRepository.sumRevenueForSuccessfulOrders()))
                .totalProducts(productRepository.countByDeletedFalse())
                .activeProducts(productRepository.countByDeletedFalseAndActiveTrue())
                .totalCustomers(userRepository.countByDeletedFalse())
                .totalReviews(productReviewRepository.countByDeletedFalse())
                .averageRating(productReviewRepository.averageRatingForActiveReviews())
                .recentOrders(orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5))
                        .getContent()
                        .stream()
                        .map(orderMapper::toOrderResponse)
                        .toList())
                .topProducts(orderItemRepository.findTopProductsByQuantitySold(PageRequest.of(0, 5)))
                .build();
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
