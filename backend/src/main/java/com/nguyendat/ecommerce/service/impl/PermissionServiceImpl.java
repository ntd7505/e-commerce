package com.nguyendat.ecommerce.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.entity.Permission;
import com.nguyendat.ecommerce.mapper.PermissionMapper;
import com.nguyendat.ecommerce.repository.PermissionRepository;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class PermissionServiceImpl implements PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;
    RoleRepository roleRepository;

    @Transactional
    public PermissionResponse createPermission(PermissionRequest request) {
        if (permissionRepository.existsById(request.getName())) {
            throw new AppException(ErrorCode.PERMISSION_EXISTED);
        }
        Permission permission = permissionMapper.toPermission(request);
        permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    @Transactional
    public void deletePermissionById(String name) {
        if (!permissionRepository.existsById(name)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        if (roleRepository.existsByPermissions_Name(name)) {
            throw new AppException(ErrorCode.PERMISSION_IN_USE);
        }
        permissionRepository.deleteById(name);
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
    }
}

