package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.Mapper;

import com.NguyenDat.ecommerce.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse toRoleResponse(Role role);
}
