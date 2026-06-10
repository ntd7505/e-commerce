package com.NguyenDat.ecommerce.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.entity.ProductVariant;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    Optional<ProductVariant> findByIdAndDeletedFalse(Long id);

    Optional<ProductVariant> findByIdAndDeletedFalseAndProductDeletedFalse(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.id IN :ids ORDER BY pv.id")
    List<ProductVariant> findAllByIdForUpdate(@Param("ids") Collection<Long> ids);

    @Query(
            """
					select pv
					from ProductVariant pv
					join pv.product p
					where pv.id = :id
						and pv.deleted = false
						and pv.active = true
						and p.deleted = false
						and p.active = true
			""")
    Optional<ProductVariant> findSellableVariantById(@Param("id") Long id);
}
