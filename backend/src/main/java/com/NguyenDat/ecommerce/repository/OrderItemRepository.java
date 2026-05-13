package com.NguyenDat.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NguyenDat.ecommerce.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
