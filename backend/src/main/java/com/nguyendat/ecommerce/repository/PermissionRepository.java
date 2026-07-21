package com.nguyendat.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nguyendat.ecommerce.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {}

