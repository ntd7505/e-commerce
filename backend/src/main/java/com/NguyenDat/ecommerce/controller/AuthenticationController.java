package com.NguyenDat.ecommerce.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.auth.AuthenticationRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.NguyenDat.ecommerce.dto.request.auth.IntrospectRequest;
import com.NguyenDat.ecommerce.dto.request.auth.LogoutRequest;
import com.NguyenDat.ecommerce.dto.request.auth.RefreshTokenRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ResetPasswordRequest;
import com.NguyenDat.ecommerce.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.dto.response.IntrospectResponse;
import com.NguyenDat.ecommerce.service.AuthenticationService;
import com.NguyenDat.ecommerce.service.PasswordManagementService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping(value = ApiConstant.AUTH_PREFIX)
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    PasswordManagementService passwordManagementService;

    @PostMapping(value = "/login")
    ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody @Valid AuthenticationRequest request) {
        AuthenticationResponse result = authenticationService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.LOGIN_SUCCESS, result));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logOut(@RequestBody @Valid LogoutRequest token) {
        authenticationService.logOut(token);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.LOGOUT_SUCCESS, null));
    }

    @PostMapping("/refresh")
    ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.REFRESH_TOKEN_SUCCESS, authenticationService.refreshToken(request)));
    }

    @PostMapping(value = "/introspect")
    ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody @Valid IntrospectRequest request) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.INTROSPECT_SUCCESS, authenticationService.introspect(request)));
    }

    @PostMapping("/forgot-password")
    ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        passwordManagementService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PASSWORD_RESET_CODE_SENT, null));
    }

    @PostMapping("/reset-password")
    ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordManagementService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PASSWORD_RESET_SUCCESS, null));
    }
}
