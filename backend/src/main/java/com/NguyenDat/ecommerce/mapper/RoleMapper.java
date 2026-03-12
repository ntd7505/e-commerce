package com.NguyenDat.ecommerce.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.entity.Permission;
import com.NguyenDat.ecommerce.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponse toRoleResponse(Role role);

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    default Set<String> mapRoles(Set<Permission> permissions) {
        if (permissions == null) return new HashSet<>();
        return permissions.stream()
                .map(Permission::getName) // lấy field name trong Role
                .collect(Collectors.toSet());
    }
}
