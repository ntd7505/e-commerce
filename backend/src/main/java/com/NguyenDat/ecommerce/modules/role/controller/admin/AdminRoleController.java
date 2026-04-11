package com.NguyenDat.ecommerce.modules.role.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.role.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.modules.role.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.modules.role.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminRoleController {
    RoleService roleService;

    @PostMapping("/roles")
    public ApiResponse<RoleResponse> createRoles(@RequestBody @Valid RoleRequest request) {
        return ApiResponse.of(ResponseCode.ROLE_CREATED, roleService.createRole(request));
    }

    @GetMapping(value = "/roles")
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.ofList(ResponseCode.ROLES_FETCHED, roleService.getAllRole());
    }

    //    @DeleteMapping("/roles/{roleName}")
    //    public ApiResponse<RoleResponse> deleteRoles(@PathVariable String roleName) {
    //        roleService.deleteRoles(roleName);
    //        return ApiResponse.of(ResponseCode.ROLE_DELETED, null);
    //    }
}
