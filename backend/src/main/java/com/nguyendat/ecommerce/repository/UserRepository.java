package com.nguyendat.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    //    User getUserById(Long id);
    //
    //    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findAllByDeletedFalse();

    long countByDeletedFalse();

    List<User> findAllByDeletedTrue();

    Optional<User> findByIdAndDeletedFalse(Long id);

    Optional<User> findByEmailAndDeletedFalse(String email);

    Page<User> findAllByDeletedFalse(Pageable pageable);

    Page<User> findAllByDeletedTrue(Pageable pageable);
}

