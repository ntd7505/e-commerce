package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.constant.ApiConstant;
import com.NguyenDat.ecommerce.constant.ResponseCode;
import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("/permissions")
    public ApiResponse<PermissionResponse> createPermissions(@RequestBody PermissionRequest request) {
        return ApiResponse.of(ResponseCode.PERMISSION_CREATED, permissionService.createPermission(request));
    }

    @DeleteMapping("/permissions/{permissionsName}")
    public ApiResponse<PermissionResponse> deletePermissions(@PathVariable String permissionsName) {
        permissionService.deletePermissionById(permissionsName);
        return ApiResponse.of(ResponseCode.PERMISSION_DELETED, null);
    }

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {
        return ApiResponse.ofList(ResponseCode.PERMISSION_FETCHED, permissionService.getAllPermissions());
    }
}
