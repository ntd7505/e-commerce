package com.nguyendat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.controller.admin.PermissionController;
import com.nguyendat.ecommerce.dto.request.PermissionRequest;
import com.nguyendat.ecommerce.dto.response.PermissionResponse;
import com.nguyendat.ecommerce.service.PermissionService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(PermissionController.class)
@AutoConfigureMockMvc(addFilters = false)
class PermissionControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    PermissionService permissionService;

    @Test
    void createPermission_shouldReturnCreatedResponse() throws Exception {
        PermissionRequest request =
                PermissionRequest.builder().name("PRODUCT_READ").build();
        PermissionResponse response =
                PermissionResponse.builder().name("PRODUCT_READ").build();
        when(permissionService.createPermission(any(PermissionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/admin/permissions")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.PERMISSION_CREATED.getCode()))
                .andExpect(jsonPath("$.data.name").value("PRODUCT_READ"));
    }

    @Test
    void getAllPermissions_shouldReturnPermissionList() throws Exception {
        when(permissionService.getAllPermissions())
                .thenReturn(List.of(
                        PermissionResponse.builder().name("PRODUCT_READ").build()));

        mockMvc.perform(get("/api/v1/admin/permissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PERMISSIONS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data[0].name").value("PRODUCT_READ"));
    }

    @Test
    void deletePermission_shouldReturnDeletedResponse() throws Exception {
        mockMvc.perform(delete("/api/v1/admin/permissions/{name}", "PRODUCT_READ"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PERMISSION_DELETED.getCode()));

        verify(permissionService).deletePermissionById("PRODUCT_READ");
    }
}

