package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDashboardResponse {
    Long totalOrders;
    Long pendingOrders;
    Long completedOrders;
    Long cancelledOrders;
    BigDecimal totalRevenue;

    Long totalProducts;
    Long activeProducts;
    Long totalCustomers;
    Long totalReviews;
    Double averageRating;

    List<OrderResponse> recentOrders;
    List<AdminTopProductResponse> topProducts;
}
