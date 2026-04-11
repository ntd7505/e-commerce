package com.NguyenDat.ecommerce.modules.role.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NguyenDat.ecommerce.modules.role.entity.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

    boolean existsByPermissions_Name(String permissionName);
}
