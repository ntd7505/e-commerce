package com.NguyenDat.ecommerce.modules.user.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.NguyenDat.ecommerce.modules.role.entity.Role;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.modules.user.dto.response.UserResponse;
import com.NguyenDat.ecommerce.modules.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(UserCreationRequest userCreationRequest);

    UserResponse toUserResponse(User user);

    // update mapper
    @Mapping(target = "roles", ignore = true)
    void updateUserMapper(@MappingTarget User user, UserUpdateRequest userUpdateRequest);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return new HashSet<>();
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}
