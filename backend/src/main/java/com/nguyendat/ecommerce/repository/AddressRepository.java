package com.nguyendat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    @Modifying
    @Query(
            """
                    update Address a
                    set a.isDefault = false
                    where a.user.id = :userId
                    and a.deleted = false
                    """)
    void clearDefaultAddressByUserId(@Param("userId") Long userId);

    Optional<Address> findByUserIdAndIsDefaultTrueAndDeletedFalse(Long userId);

    Optional<Address> findByIdAndUserIdAndDeletedFalse(Long id, Long userId);

    List<Address> findAllByUserIdAndDeletedFalse(Long userId);

    boolean existsByUserIdAndDeletedFalse(Long userId);
}

