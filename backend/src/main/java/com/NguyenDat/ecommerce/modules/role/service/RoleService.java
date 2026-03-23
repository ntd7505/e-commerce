package com.NguyenDat.ecommerce.modules.role.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.permission.entity.Permission;
import com.NguyenDat.ecommerce.modules.permission.repository.PermissionRepository;
import com.NguyenDat.ecommerce.modules.role.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.modules.role.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.modules.role.entity.Role;
import com.NguyenDat.ecommerce.modules.role.mapper.RoleMapper;
import com.NguyenDat.ecommerce.modules.role.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    public RoleResponse createRole(RoleRequest request) {
        Role role = roleMapper.toRole(request);
        // Set<String> -> Set<Permission>
        Set<Permission> permissions = request.getPermissions().stream()
                .map(pers -> permissionRepository
                        .findById(pers)
                        .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND)))
                .collect(Collectors.toSet());
        role.setPermissions(permissions);
        try {
            roleRepository.save(role);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAllRole() {
        return this.roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    //    public void deleteRoles(String roleName) {
    //        if (!roleRepository.existsById(roleName)) throw new AppException(ErrorCode.ROLE_NOT_FOUND);
    //        roleRepository.deleteById(roleName);
    //    }
}
