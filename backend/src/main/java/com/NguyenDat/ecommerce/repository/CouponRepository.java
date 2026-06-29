package com.NguyenDat.ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    boolean existsByCode(String code);

    Optional<Coupon> findCouponByIdAndDeletedFalse(Long id);

    Optional<Coupon> findCouponByIdAndDeletedTrue(Long id);

    Optional<Coupon> findByCodeAndDeletedFalseAndActiveTrue(String code);

    //    Optional<Coupon> findCouponByIdAndDeletedFalse(Long id);

    List<Coupon> findAllByDeletedFalse();

    Page<Coupon> findAllByDeletedFalse(Pageable pageable);

    List<Coupon> findAllByDeletedTrue();

    Page<Coupon> findAllByDeletedTrue(Pageable pageable);

    boolean existsByCodeAndIdNot(String code, Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query(
            """
				SELECT c
				FROM Coupon c
				WHERE c.code = :code
					AND c.deleted = false
					AND c.active = true
			""")
    Optional<Coupon> findActiveCouponByCodeForUpdate(@Param("code") String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
				SELECT c
				FROM Coupon c
				WHERE c.id = :id
			""")
    Optional<Coupon> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            SELECT c
            FROM Coupon c
            WHERE c.deleted = false
                AND c.active = true
                AND (c.startAt IS NULL OR c.startAt <= :now)
                AND (c.endAt IS NULL OR c.endAt >= :now)
                AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit)
            ORDER BY c.endAt ASC NULLS LAST, c.id DESC
            """)
    List<Coupon> findAvailableClientCoupons(@Param("now") LocalDateTime now);
}
