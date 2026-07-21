package com.nguyendat.ecommerce.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.nguyendat.ecommerce.dto.request.UserCreationRequest;
import com.nguyendat.ecommerce.dto.request.UserUpdateRequest;
import com.nguyendat.ecommerce.dto.request.auth.UserRegisterRequest;
import com.nguyendat.ecommerce.dto.response.UserResponse;
import com.nguyendat.ecommerce.entity.Role;
import com.nguyendat.ecommerce.entity.User;

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

    @Mapping(target = "id", source = "id")
    UserResponse toUserResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(UserRegisterRequest request);

    // update mapper
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUserMapper(@MappingTarget User user, UserUpdateRequest userUpdateRequest);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return new HashSet<>();
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}

