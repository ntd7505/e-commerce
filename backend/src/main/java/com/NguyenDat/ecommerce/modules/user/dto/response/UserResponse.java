package com.NguyenDat.ecommerce.modules.user.dto.response;

import java.util.Set;

import com.NguyenDat.ecommerce.modules.role.dto.response.RoleResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String email;
    String fullName;
    String phoneNumber;
    String avatarUrl;
    Set<RoleResponse> roles;
}
