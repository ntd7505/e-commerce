package com.nguyendat.ecommerce.service;

import java.util.List;

import com.nguyendat.ecommerce.dto.request.RoleRequest;
import com.nguyendat.ecommerce.dto.response.RoleResponse;

public interface RoleService {
    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRole();
}

