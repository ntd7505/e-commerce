package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissonMapper {
    PermissionResponse toPermissionResponse(Permission permission);

    Permission toPermission(PermissionRequest permissionRequest);
}
