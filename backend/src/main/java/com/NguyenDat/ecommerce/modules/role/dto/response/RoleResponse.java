package com.NguyenDat.ecommerce.modules.role.dto.response;

import java.util.Set;

import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    String name;
    String description;
    Set<PermissionResponse> permissions;
}
