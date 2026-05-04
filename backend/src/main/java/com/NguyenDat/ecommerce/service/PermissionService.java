package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;

public interface PermissionService {
    PermissionResponse createPermission(PermissionRequest request);

    void deletePermissionById(String name);

    List<PermissionResponse> getAllPermissions();
}
