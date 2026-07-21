package com.nguyendat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByIdAndUserId(Long orderId, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :orderId")
    Optional<Order> findByIdForUpdate(@Param("orderId") Long orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :orderId AND o.user.id = :userId")
    Optional<Order> findByIdAndUserIdForUpdate(@Param("orderId") Long orderId, @Param("userId") Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :orderId AND o.user.id = :userId AND o.shippingStatus = 'DELIVERED'")
    Optional<Order> findDeliveredOrderForUpdate(@Param("orderId") Long orderId, @Param("userId") Long userId);

    List<Order> findAllByUserId(long userId);

    Page<Order> findAllByUserId(long userId, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query(
            """
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.status IN ('DELIVERED', 'COMPLETED')
            """)
    java.math.BigDecimal sumRevenueForSuccessfulOrders();

    Slice<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

