package com.NguyenDat.ecommerce.controller;

import com.NguyenDat.ecommerce.dto.response.ResponseAPI;
import com.NguyenDat.ecommerce.enums.SuccessCode;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @GetMapping(value = "/roles")
    ResponseAPI<List<Role>> getAllRoles() {
        return ResponseAPI.success(SuccessCode.ROLE_FETCHED, roleService.getAllRole());
    }


}
