package com.NguyenDat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.NguyenDat.ecommerce.dto.response.AdminTopProductResponse;
import com.NguyenDat.ecommerce.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Optional<OrderItem> findByOrderIdAndProductVariantId(Long orderId, Long variantId);

    List<OrderItem> findAllByOrderUserIdAndProductVariantProductIdOrderByOrderCreatedAtDesc(
            Long userId, Long productId);

    @Query(
            """
			SELECT new com.NguyenDat.ecommerce.dto.response.AdminTopProductResponse(
				p.id,
				p.name,
				MAX(pm.url),
				SUM(oi.quantity),
				COALESCE(SUM(oi.lineTotal), 0)
			)
			FROM OrderItem oi
			JOIN oi.productVariant.product p
			LEFT JOIN p.media pm ON pm.isThumbnail = true
			WHERE oi.order.status IN ('DELIVERED', 'COMPLETED')
			GROUP BY p.id, p.name
			ORDER BY SUM(oi.quantity) DESC
			""")
    List<AdminTopProductResponse> findTopProductsByQuantitySold(Pageable pageable);

    @Query(
            "SELECT oi.productVariant.product.id AS productId, SUM(oi.quantity) AS statValue FROM OrderItem oi WHERE oi.order.status IN ('DELIVERED', 'COMPLETED') AND oi.productVariant.product.id IN :productIds GROUP BY oi.productVariant.product.id")
    List<com.NguyenDat.ecommerce.repository.projection.ProductStatProjection> getSoldCountByProductIds(
            @org.springframework.data.repository.query.Param("productIds") List<Long> productIds);
}
