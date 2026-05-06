package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.service.PermissionService;

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
