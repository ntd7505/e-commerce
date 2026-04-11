package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.modules.permission.entity.Permission;
import com.NguyenDat.ecommerce.modules.permission.repository.PermissionRepository;
import com.NguyenDat.ecommerce.modules.role.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.modules.role.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.modules.role.entity.Role;
import com.NguyenDat.ecommerce.modules.role.mapper.RoleMapper;
import com.NguyenDat.ecommerce.modules.role.repository.RoleRepository;
import com.NguyenDat.ecommerce.modules.role.service.RoleService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleServiceTest {

    @Mock
    RoleRepository roleRepository;

    @Mock
    RoleMapper roleMapper;

    @Mock
    PermissionRepository permissionRepository;

    @InjectMocks
    RoleService roleService;

    RoleRequest roleRequest;
    Role role;
    RoleResponse roleResponse;
    Permission permission;
    PermissionResponse permissionResponse;

    @BeforeEach
    void setUp() {
        permission = Permission.builder()
                .name("brand:create")
                .description("Create brand")
                .build();

        roleRequest = RoleRequest.builder()
                .name("ADMIN")
                .description("Administrator role")
                .permissions(Set.of("brand:create"))
                .build();

        role = Role.builder()
                .name("ADMIN")
                .description("Administrator role")
                .permissions(Set.of(permission))
                .build();

        permissionResponse = PermissionResponse.builder()
                .name("brand:create")
                .description("Create brand")
                .build();

        roleResponse = RoleResponse.builder()
                .name("ADMIN")
                .description("Administrator role")
                .permissions(Set.of(permissionResponse))
                .build();
    }

    @Test
    void createRole_shouldReturnRoleResponse_whenRequestIsValid() {
        when(roleRepository.existsById("ADMIN")).thenReturn(false);
        when(roleMapper.toRole(roleRequest)).thenReturn(role);
        when(permissionRepository.findById("brand:create")).thenReturn(Optional.of(permission));
        when(roleRepository.save(role)).thenReturn(role);
        when(roleMapper.toRoleResponse(role)).thenReturn(roleResponse);

        RoleResponse rs = roleService.createRole(roleRequest);
        assertEquals("ADMIN", rs.getName());
        assertEquals("Administrator role", rs.getDescription());
        assertEquals(1, rs.getPermissions().size());
        assertEquals("brand:create", rs.getPermissions().iterator().next().getName());

        verify(roleRepository).existsById("ADMIN");
        verify(permissionRepository).findById("brand:create");
        verify(roleRepository).save(role);
    }

    @Test
    void createRole_shouldThrowException_whenRoleAlreadyExists() {
        when(roleRepository.existsById("ADMIN")).thenReturn(true);
        AppException exception = assertThrows(AppException.class, () -> roleService.createRole(roleRequest));
        assertEquals(ErrorCode.ROLE_EXISTED, exception.getErrorCode());
        verify(roleMapper, never()).toRole(any());
        verify(permissionRepository, never()).findById(any());
        verify(roleRepository, never()).save(role);
    }

    @Test
    void createRole_shouldThrowException_whenPermissionNotFound() {
        when(roleRepository.existsById("ADMIN")).thenReturn(false);
        when(roleMapper.toRole(roleRequest)).thenReturn(role);
        when(permissionRepository.findById("brand:create")).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> roleService.createRole(roleRequest));
        assertEquals(ErrorCode.PERMISSION_NOT_FOUND, exception.getErrorCode());
        verify(roleRepository, never()).save(role);
        verify(permissionRepository).findById("brand:create");
        verify(roleMapper).toRole(roleRequest);
        verify(roleMapper, never()).toRoleResponse(any());
    }

    @Test
    void getAllRole_shouldReturnRoleResponseList_whenDataExists() {
        List<RoleResponse> roleResponses = new ArrayList<>();
        roleResponses.add(roleResponse);
        when(roleRepository.findAll()).thenReturn(List.of(role));
        when(roleMapper.toRoleResponse(role)).thenReturn(roleResponse);
        List<RoleResponse> rs = roleService.getAllRole();

        assertEquals(roleResponses.getFirst().getPermissions(), rs.getFirst().getPermissions());
        assertEquals(roleResponses.getFirst().getDescription(), rs.getFirst().getDescription());
        assertEquals(roleResponses.size(), rs.size());
        assertEquals(
                roleResponses.getFirst().getPermissions().iterator().next().getName(),
                rs.getFirst().getPermissions().iterator().next().getName());

        verify(roleRepository).findAll();
        verify(roleMapper).toRoleResponse(role);
    }

    @Test
    void getAllRole_shouldReturnEmptyList_whenNoDataExists() {
        when(roleRepository.findAll()).thenReturn(List.of());
        List<RoleResponse> rs = roleService.getAllRole();

        assertTrue(rs.isEmpty());
        verify(roleRepository).findAll();
        verify(roleMapper, never()).toRoleResponse(any());
    }
}
