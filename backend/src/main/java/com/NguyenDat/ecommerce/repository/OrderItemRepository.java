package com.NguyenDat.ecommerce.repository;

import com.NguyenDat.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Optional<OrderItem> findByOrderIdAndProductVariantId(Long orderId, Long variantId);

    List<OrderItem>
    findAllByOrderUserIdAndProductVariantProductIdOrderByOrderCreatedAtDesc(
            Long userId,
            Long productId
    );
}
