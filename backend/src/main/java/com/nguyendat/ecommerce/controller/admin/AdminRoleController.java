package com.nguyendat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.dto.request.RoleRequest;
import com.nguyendat.ecommerce.dto.response.RoleResponse;
import com.nguyendat.ecommerce.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.ADMIN_ONLY)
public class AdminRoleController {
    RoleService roleService;

    @PostMapping("/roles")
    public ResponseEntity<ApiResponse<RoleResponse>> createRoles(@RequestBody @Valid RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.ROLE_CREATED, roleService.createRole(request)));
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.ROLES_FETCHED, roleService.getAllRole()));
    }

    //    @DeleteMapping("/roles/{roleName}")
    //    public ApiResponse<RoleResponse> deleteRoles(@PathVariable String roleName) {
    //        roleService.deleteRoles(roleName);
    //        return ApiResponse.of(ResponseCode.ROLE_DELETED, null);
    //    }
}

