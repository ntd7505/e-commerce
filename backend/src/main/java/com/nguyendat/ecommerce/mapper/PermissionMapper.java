package com.nguyendat.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    PermissionResponse toPermissionResponse(Permission permission);

    Permission toPermission(PermissionRequest permissionRequest);
}

