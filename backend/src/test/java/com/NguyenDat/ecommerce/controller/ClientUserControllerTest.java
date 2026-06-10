package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.controller.client.ClientUserController;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.auth.UserRegisterRequest;
import com.NguyenDat.ecommerce.dto.response.UserResponse;
import com.NguyenDat.ecommerce.service.UserService;

import tools.jackson.databind.ObjectMapper;

@WebMvcTest(ClientUserController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClientUserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    @Test
    void register_shouldReturnCreatedUser() throws Exception {
        UserRegisterRequest request = UserRegisterRequest.builder()
                .email("dat@example.com")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("0900000000")
                .build();
        when(userService.register(any(UserRegisterRequest.class)))
                .thenReturn(UserResponse.builder().email("dat@example.com").build());

        mockMvc.perform(post("/api/v1/client/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.email").value("dat@example.com"));
    }

    @Test
    void getMyInfo_shouldReturnCurrentUser() throws Exception {
        when(userService.getMyInfo())
                .thenReturn(UserResponse.builder().email("dat@example.com").build());

        mockMvc.perform(get("/api/v1/client/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("dat@example.com"));
    }

    @Test
    void updateMyInfo_shouldReturnUpdatedUser() throws Exception {
        UserUpdateRequest request = UserUpdateRequest.builder()
                .fullName("Updated Name")
                .phoneNumber("0900000000")
                .build();
        when(userService.updateMyInfo(any(UserUpdateRequest.class)))
                .thenReturn(UserResponse.builder().fullName("Updated Name").build());

        mockMvc.perform(patch("/api/v1/client/users/me")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName").value("Updated Name"));
    }
}
