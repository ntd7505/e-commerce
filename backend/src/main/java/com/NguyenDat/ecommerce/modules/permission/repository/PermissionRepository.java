package com.NguyenDat.ecommerce.modules.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NguyenDat.ecommerce.modules.permission.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}
