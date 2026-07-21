package com.nguyendat.ecommerce.service;

import java.util.List;

import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;

public interface PermissionService {
    PermissionResponse createPermission(PermissionRequest request);

    void deletePermissionById(String name);

    List<PermissionResponse> getAllPermissions();
}

