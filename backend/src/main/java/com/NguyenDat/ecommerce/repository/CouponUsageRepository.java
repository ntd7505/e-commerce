package com.NguyenDat.ecommerce.repository;

import com.NguyenDat.ecommerce.entity.CouponUsage;
import com.NguyenDat.ecommerce.enums.CouponUsageStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    long countByCouponIdAndUserIdAndStatus(Long couponId, Long userId, CouponUsageStatus status);

    Optional<CouponUsage> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
                SELECT cu
                FROM CouponUsage cu
                WHERE cu.order.id = :orderId
            """)
    Optional<CouponUsage> findByOrderIdForUpdate(
            @Param("orderId") Long orderId);
}
