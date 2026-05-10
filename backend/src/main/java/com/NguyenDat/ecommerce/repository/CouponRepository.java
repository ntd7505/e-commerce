package com.NguyenDat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
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

    List<Coupon> findAllByDeletedTrue();

    boolean existsByCodeAndIdNot(String code, Long id);
}
