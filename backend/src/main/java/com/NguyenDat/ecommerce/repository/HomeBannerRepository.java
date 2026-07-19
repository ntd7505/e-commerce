package com.NguyenDat.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.HomeBanner;
import com.NguyenDat.ecommerce.enums.BannerPosition;

@Repository
public interface HomeBannerRepository extends JpaRepository<HomeBanner, Long> {
    
    @Query("SELECT b FROM HomeBanner b WHERE b.deleted = false " +
           "AND (:position IS NULL OR b.position = :position) " +
           "AND (:active IS NULL OR b.isActive = :active)")
    Page<HomeBanner> findAdminBanners(@Param("position") BannerPosition position, 
                                      @Param("active") Boolean active, 
                                      Pageable pageable);

    @Query("SELECT b FROM HomeBanner b " +
           "JOIN FETCH b.product p " +
           "WHERE b.deleted = false " +
           "AND b.isActive = true " +
           "AND p.active = true " +
           "AND p.deleted = false " +
           "AND (b.startsAt IS NULL OR b.startsAt <= :now) " +
           "AND (b.endsAt IS NULL OR b.endsAt >= :now) " +
           "ORDER BY b.position ASC, b.sortOrder ASC")
    List<HomeBanner> findActiveClientBanners(@Param("now") LocalDateTime now);
    
    Optional<HomeBanner> findByIdAndDeletedFalse(Long id);
    
    List<HomeBanner> findByPositionAndIsActiveTrueAndDeletedFalse(BannerPosition position);
    
    @Query("SELECT COALESCE(MAX(b.sortOrder), 0) FROM HomeBanner b WHERE b.position = :position AND b.deleted = false")
    int getMaxSortOrderByPosition(@Param("position") BannerPosition position);
}
