package com.NguyenDat.ecommerce.mapper;

import com.NguyenDat.ecommerce.dto.request.StaffCreationRequest;
import com.NguyenDat.ecommerce.dto.response.StaffCreationResponse;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    User toUser(StaffCreationRequest staffCreationRequest);

    //User to StaffCreationResponse
    StaffCreationResponse toStaffCreationResponse(User user);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) return new HashSet<>();
        return roles.stream()
                .map(Role::getName)  // lấy field name trong Role
                .collect(Collectors.toSet());
    }
}
