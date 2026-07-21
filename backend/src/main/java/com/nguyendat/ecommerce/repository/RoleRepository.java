package com.nguyendat.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nguyendat.ecommerce.entity.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

    boolean existsByPermissions_Name(String permissionName);

    @EntityGraph(attributePaths = "permissions")
    @Query("select distinct r from Role r")
    List<Role> findAllWithPermissions();
}

