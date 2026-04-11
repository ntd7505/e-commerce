package com.NguyenDat.ecommerce.modules.permission.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.permission.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.modules.permission.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("/permissions")
    public ApiResponse<PermissionResponse> createPermission(@RequestBody @Valid PermissionRequest request) {
        return ApiResponse.of(ResponseCode.PERMISSION_CREATED, permissionService.createPermission(request));
    }

    @DeleteMapping("/permissions/{name}")
    public ApiResponse<Void> deletePermission(@PathVariable String name) {
        permissionService.deletePermissionById(name);
        return ApiResponse.of(ResponseCode.PERMISSION_DELETED, null);
    }

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {
        return ApiResponse.ofList(ResponseCode.PERMISSIONS_FETCHED, permissionService.getAllPermissions());
    }
}
