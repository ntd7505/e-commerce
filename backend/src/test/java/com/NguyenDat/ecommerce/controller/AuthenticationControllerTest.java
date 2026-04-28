package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.auth.controller.AuthenticationController;
import com.NguyenDat.ecommerce.modules.auth.dto.request.AuthenticationRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.IntrospectRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.RefreshTokenRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.modules.auth.dto.response.IntrospectResponse;
import com.NguyenDat.ecommerce.modules.auth.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AuthenticationController.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthenticationService authenticationService;

    @Autowired
    ObjectMapper objectMapper;

    AuthenticationRequest request;
    AuthenticationResponse response;
    IntrospectRequest introspectRequest;
    IntrospectResponse introspectResponse;
    RefreshTokenRequest refreshTokenRequest;

    @BeforeEach
    void setUp() {
        request = AuthenticationRequest.builder()
                .email("admin@gmail.com")
                .password("123456")
                .build();

        response = AuthenticationResponse.builder()
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .authenticated(true)
                .build();

        introspectRequest = IntrospectRequest.builder().token("token-test").build();

        introspectResponse = IntrospectResponse.builder().valid(true).build();

        refreshTokenRequest =
                RefreshTokenRequest.builder().refreshToken("refresh-token").build();
    }

    @Test
    void login_shouldReturnSuccessResponse_whenRequestIsValid() throws Exception {
        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenReturn(response);
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.LOGIN_SUCCESS.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.LOGIN_SUCCESS.getMessage()))
                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.data.authenticated").value(true));

        verify(authenticationService).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void login_shouldReturnBadRequest_whenEmailIsBlank() throws Exception {
        request = AuthenticationRequest.builder().email("").password("123456").build();
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(9998))
                .andExpect(jsonPath("$.message").value("Invalid request data"));
        verify(authenticationService, never()).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void login_shouldReturnBadRequest_whenPasswordIsBlank() throws Exception {
        request = AuthenticationRequest.builder()
                .email("admin@gmail.com")
                .password("")
                .build();
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(9998))
                .andExpect(jsonPath("$.message").value("Invalid request data"));

        verify(authenticationService, never()).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void login_shouldReturnErrorResponse_whenUserNotFound() throws Exception {
        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenThrow(new AppException(ErrorCode.USER_NOT_EXISTED));
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(
                        status().is(ErrorCode.USER_NOT_EXISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_NOT_EXISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_NOT_EXISTED.getMessage()));

        verify(authenticationService).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void login_shouldReturnErrorResponse_whenPasswordIsWrong() throws Exception {
        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenThrow(new AppException(ErrorCode.UNAUTHENTICATED));
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(ErrorCode.UNAUTHENTICATED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.UNAUTHENTICATED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.UNAUTHENTICATED.getMessage()));

        verify(authenticationService).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void introspect_shouldReturnSuccessResponse_whenTokenIsValid() throws Exception {
        when(authenticationService.introspect(any(IntrospectRequest.class))).thenReturn(introspectResponse);
        mockMvc.perform(post("/auth/introspect")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(introspectRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.INTROSPECT_SUCCESS.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.INTROSPECT_SUCCESS.getMessage()))
                .andExpect(jsonPath("$.data.valid").value(true));

        verify(authenticationService).introspect(any(IntrospectRequest.class));
    }

    @Test
    void introspect_shouldReturnErrorResponse_whenTokenIsInvalid() throws Exception {
        when(authenticationService.introspect(any(IntrospectRequest.class)))
                .thenThrow(new AppException(ErrorCode.TOKEN_INVALID));
        mockMvc.perform(post("/auth/introspect")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(introspectRequest)))
                .andExpect(status().is(ErrorCode.TOKEN_INVALID.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.TOKEN_INVALID.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.TOKEN_INVALID.getMessage()));

        verify(authenticationService).introspect(any(IntrospectRequest.class));
    }

    @Test
    void introspect_shouldReturnBadRequest_whenTokenIsBlank() throws Exception {
        introspectRequest = IntrospectRequest.builder().token("").build();
        mockMvc.perform(post("/auth/introspect")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(introspectRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(9998))
                .andExpect(jsonPath("$.message").value("Invalid request data"));
        verify(authenticationService, never()).introspect(any(IntrospectRequest.class));
    }

    @Test
    void refreshToken_shouldReturnSuccessResponse_whenRefreshTokenIsValid() throws Exception {
        when(authenticationService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(response);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshTokenRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.LOGIN_SUCCESS.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.LOGIN_SUCCESS.getMessage()))
                .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.data.authenticated").value(true));

        verify(authenticationService).refreshToken(any(RefreshTokenRequest.class));
    }

    @Test
    void refreshToken_shouldReturnErrorResponse_whenRefreshTokenIsBlacklisted() throws Exception {
        when(authenticationService.refreshToken(any(RefreshTokenRequest.class)))
                .thenThrow(new AppException(ErrorCode.TOKEN_BLACKLISTED));

        mockMvc.perform(post("/auth/refresh")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshTokenRequest)))
                .andExpect(
                        status().is(ErrorCode.TOKEN_BLACKLISTED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.TOKEN_BLACKLISTED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.TOKEN_BLACKLISTED.getMessage()));

        verify(authenticationService).refreshToken(any(RefreshTokenRequest.class));
    }

    @Test
    void refreshToken_shouldReturnBadRequest_whenRefreshTokenIsBlank() throws Exception {
        refreshTokenRequest = RefreshTokenRequest.builder().refreshToken("").build();

        mockMvc.perform(post("/auth/refresh")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshTokenRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(9998))
                .andExpect(jsonPath("$.message").value("Invalid request data"));

        verify(authenticationService, never()).refreshToken(any(RefreshTokenRequest.class));
    }

    @Test
    void login_shouldReturnErrorResponse_whenUserIsInactive() throws Exception {
        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenThrow(new AppException(ErrorCode.USER_INACTIVE));
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(ErrorCode.USER_INACTIVE.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_INACTIVE.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_INACTIVE.getMessage()));

        verify(authenticationService).authenticate(any(AuthenticationRequest.class));
    }

    @Test
    void login_shouldReturnErrorResponse_whenUserIsDeleted() throws Exception {
        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenThrow(new AppException(ErrorCode.USER_DELETED));
        mockMvc.perform(post("/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(ErrorCode.USER_DELETED.getStatusCode().value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.USER_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.USER_DELETED.getMessage()));

        verify(authenticationService).authenticate(any(AuthenticationRequest.class));
    }
}
