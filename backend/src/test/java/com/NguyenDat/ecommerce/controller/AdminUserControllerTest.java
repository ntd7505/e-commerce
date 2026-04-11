package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
import com.NguyenDat.ecommerce.modules.user.controller.admin.AdminUserController;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.modules.user.dto.response.UserResponse;
import com.NguyenDat.ecommerce.modules.user.service.UserService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AdminUserController.class)
@AutoConfigureMockMvc(addFilters = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    UserResponse userResponse;
    UserCreationRequest userCreationRequest;
    UserUpdateRequest userUpdateRequest;

    @BeforeEach
    void setUp() {
        userCreationRequest = UserCreationRequest.builder()
                .email("dat@gmail.com")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .build();

        userUpdateRequest = UserUpdateRequest.builder()
                .fullName("Nguyen Dat Updated")
                .phoneNumber("0987654321")
                .avatarUrl("updated-avatar.png")
                .build();

        userResponse = UserResponse.builder()
                .email("dat@gmail.com")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .roles(Set.of())
                .build();
    }

    @Test
    void createStaff_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(userService.createNewUsers(any(UserCreationRequest.class))).thenReturn(userResponse);
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USER_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USER_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.email").value("dat@gmail.com"))
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Dat"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0912345678"))
                .andExpect(jsonPath("$.data.avatarUrl").value("avatar.png"));

        verify(userService).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void createStaff_shouldReturnBadRequest_whenEmailIsBlank() throws Exception {
        userCreationRequest = UserCreationRequest.builder()
                .email("")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .build();
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(userService, never()).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void createStaff_shouldReturnBadRequest_whenPasswordIsBlank() throws Exception {
        userCreationRequest = UserCreationRequest.builder()
                .email("dat@gmail.com")
                .password("")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .build();
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(userService, never()).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void createStaff_shouldReturnBadRequest_whenPhoneNumberIsInvalid() throws Exception {
        userCreationRequest = UserCreationRequest.builder()
                .email("dat@gmail.com")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("091234567")
                .avatarUrl("avatar.png")
                .build();
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(userService, never()).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void createStaff_shouldReturnErrorResponse_whenEmailAlreadyExists() throws Exception {
        when(userService.createNewUsers(any(UserCreationRequest.class)))
                .thenThrow(new AppException(ErrorCode.EMAIL_EXISTED));
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().is(ErrorCode.EMAIL_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.EMAIL_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.EMAIL_EXISTED.getMessage()));
        verify(userService).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void createStaff_shouldReturnErrorResponse_whenPhoneAlreadyExists() throws Exception {
        when(userService.createNewUsers(any(UserCreationRequest.class)))
                .thenThrow(new AppException(ErrorCode.PHONE_EXISTED));
        mockMvc.perform(post("/api/v1/admin/users")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCreationRequest)))
                .andExpect(status().is(ErrorCode.PHONE_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PHONE_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PHONE_EXISTED.getMessage()));
        verify(userService).createNewUsers(any(UserCreationRequest.class));
    }

    @Test
    void getUserById_shouldReturnFetchedResponse_whenUserExists() throws Exception {
        when(userService.getUserById(1L)).thenReturn(userResponse);
        mockMvc.perform(get("/api/v1/admin/users/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USER_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USER_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.email").value("dat@gmail.com"))
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Dat"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0912345678"))
                .andExpect(jsonPath("$.data.avatarUrl").value("avatar.png"));

        verify(userService).getUserById(1L);
    }

    @Test
    void getUserById_shouldReturnErrorResponse_whenUserNotFound() throws Exception {
        when(userService.getUserById(1L)).thenThrow(new AppException(ErrorCode.USER_NOT_EXISTED));
        mockMvc.perform(get("/api/v1/admin/users/{id}", 1))
                .andExpect(
                        status().is(ErrorCode.USER_NOT_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_NOT_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_EXISTED.getMessage()));
        verify(userService).getUserById(1L);
    }

    @Test
    void getAllUser_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        List<UserResponse> userResponseList = new ArrayList<>();
        userResponseList.add(userResponse);
        when(userService.getAllUsers()).thenReturn(userResponseList);
        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USERS_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USERS_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data[0].email").value("dat@gmail.com"))
                .andExpect(jsonPath("$.data[0].fullName").value("Nguyen Dat"))
                .andExpect(jsonPath("$.data[0].phoneNumber").value("0912345678"))
                .andExpect(jsonPath("$.data[0].avatarUrl").value("avatar.png"));

        verify(userService).getAllUsers();
    }

    @Test
    void getAllUser_shouldReturnNoDataFound_whenListIsEmpty() throws Exception {
        List<UserResponse> userResponseList = new ArrayList<>();
        when(userService.getAllUsers()).thenReturn(userResponseList);
        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.NO_DATA_FOUND.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.NO_DATA_FOUND.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(0));
        verify(userService).getAllUsers();
    }

    @Test
    void updateStaffById_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        UserResponse updatedUserResponse = UserResponse.builder()
                .email("dat@gmail.com")
                .fullName("Nguyen Dat Updated")
                .phoneNumber("0987654321")
                .avatarUrl("updated-avatar.png")
                .roles(Set.of())
                .build();
        when(userService.updateStaffById(eq(1L), any(UserUpdateRequest.class))).thenReturn(updatedUserResponse);
        mockMvc.perform(put("/api/v1/admin/users/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USER_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USER_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Dat Updated"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0987654321"))
                .andExpect(jsonPath("$.data.avatarUrl").value("updated-avatar.png"));
        verify(userService).updateStaffById(eq(1L), any(UserUpdateRequest.class));
    }

    @Test
    void updateStaffById_shouldReturnBadRequest_whenFullNameIsBlank() throws Exception {
        userUpdateRequest = UserUpdateRequest.builder()
                .fullName("")
                .phoneNumber("0987654321")
                .avatarUrl("updated-avatar.png")
                .build();
        mockMvc.perform(put("/api/v1/admin/users/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));
        verify(userService, never()).updateStaffById(anyLong(), any(UserUpdateRequest.class));
    }

    @Test
    void updateStaffById_shouldReturnBadRequest_whenPhoneNumberIsInvalid() throws Exception {
        userUpdateRequest = UserUpdateRequest.builder()
                .fullName("Nguyen Dat Updated")
                .phoneNumber("098765431")
                .avatarUrl("updated-avatar.png")
                .build();

        mockMvc.perform(put("/api/v1/admin/users/{userId}", 1)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(ErrorCode.INVALID_KEY.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_KEY.getMessage()));

        verify(userService, never()).updateStaffById(anyLong(), any(UserUpdateRequest.class));
    }

    @Test
    void updateStaffById_shouldReturnErrorResponse_whenPhoneAlreadyExists() throws Exception {
        when(userService.updateStaffById(anyLong(), any(UserUpdateRequest.class)))
                .thenThrow(new AppException(ErrorCode.PHONE_EXISTED));

        mockMvc.perform(put("/api/v1/admin/users/{userId}", 1)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(status().is(ErrorCode.PHONE_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.PHONE_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.PHONE_EXISTED.getMessage()));

        verify(userService).updateStaffById(anyLong(), any(UserUpdateRequest.class));
    }

    @Test
    void updateStaffById_shouldReturnErrorResponse_whenUserNotFound() throws Exception {
        when(userService.updateStaffById(anyLong(), any(UserUpdateRequest.class)))
                .thenThrow(new AppException(ErrorCode.USER_NOT_EXISTED));
        mockMvc.perform(put("/api/v1/admin/users/{userId}", 1)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userUpdateRequest)))
                .andExpect(
                        status().is(ErrorCode.USER_NOT_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_NOT_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_EXISTED.getMessage()));

        verify(userService).updateStaffById(anyLong(), any(UserUpdateRequest.class));
    }

    @Test
    void deleteStaff_shouldReturnDeletedResponse_whenUserExists() throws Exception {
        doNothing().when(userService).deleteStaff(1L);

        mockMvc.perform(delete("/api/v1/admin/users/{userId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USER_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USER_DELETED.getMessage()));

        verify(userService).deleteStaff(1L);
    }

    @Test
    void deleteStaff_shouldReturnErrorResponse_whenUserNotFound() throws Exception {
        doThrow(new AppException(ErrorCode.USER_NOT_EXISTED)).when(userService).deleteStaff(1L);

        mockMvc.perform(delete("/api/v1/admin/users/{userId}", 1L))
                .andExpect(
                        status().is(ErrorCode.USER_NOT_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_NOT_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_EXISTED.getMessage()));

        verify(userService).deleteStaff(1L);
    }

    @Test
    void getMyInfo_shouldReturnFetchedResponse_whenUserExists() throws Exception {
        when(userService.getMyInfo()).thenReturn(userResponse);

        mockMvc.perform(get("/api/v1/admin/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.USER_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.USER_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.email").value("dat@gmail.com"))
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Dat"))
                .andExpect(jsonPath("$.data.phoneNumber").value("0912345678"))
                .andExpect(jsonPath("$.data.avatarUrl").value("avatar.png"));

        verify(userService).getMyInfo();
    }

    @Test
    void getMyInfo_shouldReturnErrorResponse_whenUserNotFound() throws Exception {
        when(userService.getMyInfo()).thenThrow(new AppException(ErrorCode.USER_NOT_EXISTED));

        mockMvc.perform(get("/api/v1/admin/users/me"))
                .andExpect(
                        status().is(ErrorCode.USER_NOT_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_NOT_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_EXISTED.getMessage()));

        verify(userService).getMyInfo();
    }
}
