package com.NguyenDat.ecommerce.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.UserResponse;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    //    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    User toUser(UserCreationRequest userCreationRequest);

    // User to StaffCreationResponse
    UserResponse toStaffResponse(User user);

    // update mapper
    @Mapping(target = "roles", ignore = true)
    void updateUserMapper(@MappingTarget User user, UserUpdateRequest userUpdateRequest);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return new HashSet<>();
        return roles.stream()
                .map(Role::getName) // lấy field name trong Role
                .collect(Collectors.toSet());
    }
}
