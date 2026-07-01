package com.NguyenDat.ecommerce.dto.response;

import java.util.Set;

import com.NguyenDat.ecommerce.enums.Active;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String email;
    String fullName;
    String phoneNumber;
    String avatarUrl;
    Active status;
    Set<RoleResponse> roles;
}
