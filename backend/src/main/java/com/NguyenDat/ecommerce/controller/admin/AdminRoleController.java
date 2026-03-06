package com.NguyenDat.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.constant.SuccessCode;
import com.NguyenDat.ecommerce.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @GetMapping(value = "/roles")
    ApiResponse<List<Role>> getAllRoles() {
        return ApiResponse.success(SuccessCode.ROLE_FETCHED, roleService.getAllRole());
    }
}
