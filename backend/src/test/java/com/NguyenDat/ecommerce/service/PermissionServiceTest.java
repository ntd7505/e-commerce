package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.PermissionRequest;
import com.NguyenDat.ecommerce.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.entity.Permission;
import com.NguyenDat.ecommerce.mapper.PermissionMapper;
import com.NguyenDat.ecommerce.repository.PermissionRepository;
import com.NguyenDat.ecommerce.repository.RoleRepository;
import com.NguyenDat.ecommerce.service.impl.PermissionServiceImpl;

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
        PermissionRequest request = PermissionRequest.builder().name("PRODUCT_READ").build();
        Permission permission = Permission.builder().name("PRODUCT_READ").build();
        PermissionResponse response = PermissionResponse.builder().name("PRODUCT_READ").build();
        when(permissionMapper.toPermission(request)).thenReturn(permission);
        when(permissionMapper.toPermissionResponse(permission)).thenReturn(response);

        PermissionResponse result = permissionService.createPermission(request);

        assertEquals(response, result);
        verify(permissionRepository).save(permission);
    }

    @Test
    void createPermission_shouldRejectDuplicateName() {
        PermissionRequest request = PermissionRequest.builder().name("PRODUCT_READ").build();
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
}
