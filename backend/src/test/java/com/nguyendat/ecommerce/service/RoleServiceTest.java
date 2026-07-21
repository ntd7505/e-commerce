package com.nguyendat.ecommerce.service;

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

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.RoleRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.dto.response.RoleResponse;
import com.nguyendat.ecommerce.entity.Permission;
import com.nguyendat.ecommerce.entity.Role;
import com.nguyendat.ecommerce.mapper.RoleMapper;
import com.nguyendat.ecommerce.repository.PermissionRepository;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.service.impl.RoleServiceImpl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class RoleServiceTest {

    @Mock
    RoleRepository roleRepository;

    @Mock
    RoleMapper roleMapper;

    @Mock
    PermissionRepository permissionRepository;

    @InjectMocks
    RoleServiceImpl roleService;

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
        when(roleRepository.findAllWithPermissions()).thenReturn(List.of(role));
        when(roleMapper.toRoleResponse(role)).thenReturn(roleResponse);
        List<RoleResponse> rs = roleService.getAllRole();

        assertEquals(roleResponses.getFirst().getPermissions(), rs.getFirst().getPermissions());
        assertEquals(roleResponses.getFirst().getDescription(), rs.getFirst().getDescription());
        assertEquals(roleResponses.size(), rs.size());
        assertEquals(
                roleResponses.getFirst().getPermissions().iterator().next().getName(),
                rs.getFirst().getPermissions().iterator().next().getName());

        verify(roleRepository).findAllWithPermissions();
        verify(roleMapper).toRoleResponse(role);
    }

    @Test
    void getAllRole_shouldReturnEmptyList_whenNoDataExists() {
        when(roleRepository.findAllWithPermissions()).thenReturn(List.of());
        List<RoleResponse> rs = roleService.getAllRole();

        assertTrue(rs.isEmpty());
        verify(roleRepository).findAllWithPermissions();
        verify(roleMapper, never()).toRoleResponse(any());
    }
}

