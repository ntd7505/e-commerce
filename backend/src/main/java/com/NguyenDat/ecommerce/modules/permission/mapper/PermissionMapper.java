package com.NguyenDat.ecommerce.modules.permission.mapper;

import org.mapstruct.Mapper;

import com.NguyenDat.ecommerce.modules.permission.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.modules.permission.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionResponse toPermissionResponse(Permission permission);

    Permission toPermission(PermissionRequest permissionRequest);
}
