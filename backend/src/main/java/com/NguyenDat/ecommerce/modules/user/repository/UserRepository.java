package com.NguyenDat.ecommerce.modules.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.modules.user.entity.User;

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

    List<User> findAllByDeletedTrue();

    Optional<User> findByIdAndDeletedFalse(Long id);

    Optional<User> findByEmailAndDeletedFalse(String email);
}
