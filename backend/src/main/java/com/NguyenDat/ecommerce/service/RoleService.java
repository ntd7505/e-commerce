package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.dto.response.RoleResponse;

public interface RoleService {
    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRole();
}
