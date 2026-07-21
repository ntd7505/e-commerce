package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.entity.Permission;
import com.nguyendat.ecommerce.mapper.PermissionMapper;
import com.nguyendat.ecommerce.repository.PermissionRepository;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.service.impl.PermissionServiceImpl;

@ExtendWith(MockitoExtension.class)
class PermissionServiceTest {

    @Mock
    PermissionRepository permissionRepository;

    @Mock
    PermissionMapper permissionMapper;

    @Mock
    RoleRepository roleRepository;

    @InjectMocks
    PermissionServiceImpl permissionService;

    @Test
    void createPermission_shouldSaveAndMapNewPermission() {
        PermissionRequest request =
                PermissionRequest.builder().name("PRODUCT_READ").build();
        Permission permission = Permission.builder().name("PRODUCT_READ").build();
        PermissionResponse response =
                PermissionResponse.builder().name("PRODUCT_READ").build();
        when(permissionMapper.toPermission(request)).thenReturn(permission);
        when(permissionMapper.toPermissionResponse(permission)).thenReturn(response);

        PermissionResponse result = permissionService.createPermission(request);

        assertEquals(response, result);
        verify(permissionRepository).save(permission);
    }

    @Test
    void createPermission_shouldRejectDuplicateName() {
        PermissionRequest request =
                PermissionRequest.builder().name("PRODUCT_READ").build();
        when(permissionRepository.existsById("PRODUCT_READ")).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> permissionService.createPermission(request));

        assertEquals(ErrorCode.PERMISSION_EXISTED, exception.getErrorCode());
        verify(permissionRepository, never()).save(any());
    }

    @Test
    void deletePermission_shouldRejectPermissionInUse() {
        when(permissionRepository.existsById("PRODUCT_READ")).thenReturn(true);
        when(roleRepository.existsByPermissions_Name("PRODUCT_READ")).thenReturn(true);

        AppException exception =
                assertThrows(AppException.class, () -> permissionService.deletePermissionById("PRODUCT_READ"));

        assertEquals(ErrorCode.PERMISSION_IN_USE, exception.getErrorCode());
        verify(permissionRepository, never()).deleteById(any());
    }

    @Test
    void deletePermission_shouldDeleteUnusedPermission() {
        when(permissionRepository.existsById("PRODUCT_READ")).thenReturn(true);

        permissionService.deletePermissionById("PRODUCT_READ");

        verify(permissionRepository).deleteById("PRODUCT_READ");
    }

    @Test
    void deletePermission_shouldRejectMissingPermission() {
        AppException exception =
                assertThrows(AppException.class, () -> permissionService.deletePermissionById("PRODUCT_READ"));

        assertEquals(ErrorCode.PERMISSION_NOT_FOUND, exception.getErrorCode());
        verifyNoInteractions(roleRepository);
    }

    @Test
    void getAllPermissions_shouldMapRepositoryResults() {
        Permission permission = Permission.builder().name("PRODUCT_READ").build();
        PermissionResponse response =
                PermissionResponse.builder().name("PRODUCT_READ").build();
        when(permissionRepository.findAll()).thenReturn(List.of(permission));
        when(permissionMapper.toPermissionResponse(permission)).thenReturn(response);

        assertEquals(List.of(response), permissionService.getAllPermissions());
    }
}

