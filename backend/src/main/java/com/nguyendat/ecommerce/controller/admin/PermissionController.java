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
import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.ADMIN_ONLY)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping("/permissions")
    public ResponseEntity<ApiResponse<PermissionResponse>> createPermission(
            @RequestBody @Valid PermissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.PERMISSION_CREATED, permissionService.createPermission(request)));
    }

    @DeleteMapping("/permissions/{name}")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable String name) {
        permissionService.deletePermissionById(name);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PERMISSION_DELETED, null));
    }

    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getAllPermissions() {
        return ResponseEntity.ok(
                ApiResponse.ofList(ResponseCode.PERMISSIONS_FETCHED, permissionService.getAllPermissions()));
    }
}

