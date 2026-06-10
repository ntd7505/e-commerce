package com.NguyenDat.ecommerce.repository;

import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.OrderCancelRequest;

@Repository
public interface OrderCancelRequestRepository extends JpaRepository<OrderCancelRequest, Long> {
    boolean existsByOrderId(Long orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
				select r from OrderCancelRequest r
				where r.id = :requestId
				and r.status = 'PENDING'
			""")
    Optional<OrderCancelRequest> findPendingCancelRequestById(@Param("requestId") Long requestId);
}
