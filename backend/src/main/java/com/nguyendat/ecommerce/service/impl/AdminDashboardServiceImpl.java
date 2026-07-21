package com.nguyendat.ecommerce.service.impl;

import java.math.BigDecimal;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.dto.response.AdminDashboardResponse;
import com.nguyendat.ecommerce.enums.OrderStatus;
import com.nguyendat.ecommerce.mapper.OrderMapper;
import com.nguyendat.ecommerce.repository.OrderItemRepository;
import com.nguyendat.ecommerce.repository.OrderRepository;
import com.nguyendat.ecommerce.repository.ProductRepository;
import com.nguyendat.ecommerce.repository.ProductReviewRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.AdminDashboardService;

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
                .recentOrders(orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5)).getContent().stream()
                        .map(orderMapper::toOrderResponse)
                        .toList())
                .topProducts(orderItemRepository.findTopProductsByQuantitySold(PageRequest.of(0, 5)))
                .build();
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

