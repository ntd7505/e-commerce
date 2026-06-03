package com.NguyenDat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByIdAndUserId(Long orderId, Long id);

    @Query("SELECT o FROM Order o WHERE o.id = :orderId AND o.user.id = :userId AND o.shippingStatus = 'DELIVERED'")
    Optional<Order> findDeliveredOrder(@Param("orderId") Long orderId, @Param("userId") Long userId);

    List<Order> findAllByUserId(long userId);

    Page<Order> findAllByUserId(long userId, Pageable pageable);
}
