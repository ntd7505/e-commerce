package com.NguyenDat.ecommerce.modules.permission.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.permission.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.modules.permission.entity.Permission;
import com.NguyenDat.ecommerce.modules.permission.mapper.PermissionMapper;
import com.NguyenDat.ecommerce.modules.permission.repository.PermissionRepository;
import com.NguyenDat.ecommerce.modules.role.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class PermissionService {
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
