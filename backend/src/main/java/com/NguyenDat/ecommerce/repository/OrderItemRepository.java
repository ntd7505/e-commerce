package com.NguyenDat.ecommerce.repository;

import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.dto.response.AdminTopProductResponse;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Optional<OrderItem> findByOrderIdAndProductVariantId(Long orderId, Long variantId);

    List<OrderItem>
    findAllByOrderUserIdAndProductVariantProductIdOrderByOrderCreatedAtDesc(
            Long userId,
            Long productId
    );

    @Query("""
            SELECT new com.NguyenDat.ecommerce.dto.response.AdminTopProductResponse(
                oi.productVariant.product.id,
                oi.productVariant.product.name,
                SUM(oi.quantity),
                COALESCE(SUM(oi.lineTotal), 0)
            )
            FROM OrderItem oi
            WHERE oi.order.status IN ('DELIVERED', 'COMPLETED')
            GROUP BY oi.productVariant.product.id, oi.productVariant.product.name
            ORDER BY SUM(oi.quantity) DESC
            """)
    List<AdminTopProductResponse> findTopProductsByQuantitySold(Pageable pageable);
}
