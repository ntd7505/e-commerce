package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.permission.dto.response.PermissionResponse;
import com.NguyenDat.ecommerce.modules.role.controller.admin.AdminRoleController;
import com.NguyenDat.ecommerce.modules.role.dto.request.RoleRequest;
import com.NguyenDat.ecommerce.modules.role.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.modules.role.service.RoleService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AdminRoleController.class)
@AutoConfigureMockMvc(addFilters = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
class RoleControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    RoleService roleService;

    RoleRequest roleRequest;
    RoleResponse roleResponse;
    PermissionResponse permissionResponse;

    @BeforeEach
    void setUp() {
        roleRequest = RoleRequest.builder()
                .name("ADMIN")
                .description("Administrator role")
                .permissions(Set.of("brand:create"))
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
    void createRoles_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(roleService.createRole(any(RoleRequest.class))).thenReturn(roleResponse);
        mockMvc.perform(post("/api/v1/admin/roles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ROLE_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ROLE_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.name").value("ADMIN"))
                .andExpect(jsonPath("$.data.description").value("Administrator role"))
                .andExpect(jsonPath("$.data.description").value("Administrator role"))
                .andExpect(jsonPath("$.data.permissions[0].name").value("brand:create"))
                .andExpect(jsonPath("$.data.permissions[0].description").value("Create brand"));

        verify(roleService).createRole(any(RoleRequest.class));
    }

    @Test
    void createRoles_shouldReturnBadRequest_whenNameIsBlank() throws Exception {
        roleRequest = RoleRequest.builder()
                .name("")
                .description("Administrator role")
                .permissions(Set.of("brand:create"))
                .build();
        mockMvc.perform(post("/api/v1/admin/roles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));
        verify(roleService, never()).createRole(any(RoleRequest.class));
    }

    @Test
    void createRoles_shouldReturnBadRequest_whenPermissionsIsEmpty() throws Exception {
        roleRequest = RoleRequest.builder()
                .name("ADMIN")
                .description("Administrator role")
                .permissions(Set.of())
                .build();
        mockMvc.perform(post("/api/v1/admin/roles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));
        verify(roleService, never()).createRole(any(RoleRequest.class));
    }

    @Test
    void createRoles_shouldReturnErrorResponse_whenRoleAlreadyExists() throws Exception {
        when(roleService.createRole(any(RoleRequest.class))).thenThrow(new AppException(ErrorCode.ROLE_EXISTED));
        mockMvc.perform(post("/api/v1/admin/roles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.ROLE_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.ROLE_EXISTED.getMessage()));
        verify(roleService).createRole(any(RoleRequest.class));
    }

    @Test
    void createRoles_shouldReturnErrorResponse_whenPermissionNotFound() throws Exception {
        when(roleService.createRole(any(RoleRequest.class)))
                .thenThrow(new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        mockMvc.perform(post("/api/v1/admin/roles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().is(
                                ErrorCode.PERMISSION_NOT_FOUND.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PERMISSION_NOT_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PERMISSION_NOT_FOUND.getMessage()));
        verify(roleService).createRole(any(RoleRequest.class));
    }

    @Test
    void getAllRoles_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        List<RoleResponse> roleResponseList = new ArrayList<>();
        roleResponseList.add(roleResponse);
        when(roleService.getAllRole()).thenReturn(roleResponseList);
        mockMvc.perform(get("/api/v1/admin/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ROLES_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ROLES_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data[0].name").value("ADMIN"))
                .andExpect(jsonPath("$.data[0].description").value("Administrator role"))
                .andExpect(jsonPath("$.data[0].permissions[0].name").value("brand:create"))
                .andExpect(jsonPath("$.data[0].permissions[0].description").value("Create brand"));
        verify(roleService).getAllRole();
    }

    @Test
    void getAllRoles_shouldReturnNoDataFound_whenListIsEmpty() throws Exception {
        //        List<RoleResponse> roleResponseList = new ArrayList<>();
        when(roleService.getAllRole()).thenReturn(List.of());
        mockMvc.perform(get("/api/v1/admin/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.NO_DATA_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.NO_DATA_FOUND.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(0));

        verify(roleService).getAllRole();
    }
}
