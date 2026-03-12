package com.NguyenDat.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.entity.Permission;
import com.NguyenDat.ecommerce.exception.AppException;
import com.NguyenDat.ecommerce.exception.ErrorCode;
import com.NguyenDat.ecommerce.mapper.PermissonMapper;
import com.NguyenDat.ecommerce.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissonMapper permissonMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissonMapper.toPermission(request);
        permissionRepository.save(permission);
        return permissonMapper.toPermissionResponse(permission);
    }

    public void deletePermissionById(String permissionsName) {
        if (!permissionRepository.existsById(permissionsName)) throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        permissionRepository.deleteById(permissionsName);
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissonMapper::toPermissionResponse)
                .toList();
    }
}
