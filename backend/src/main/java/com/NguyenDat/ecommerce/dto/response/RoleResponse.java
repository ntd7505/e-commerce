package com.NguyenDat.ecommerce.dto.response;

import java.util.Set;

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
