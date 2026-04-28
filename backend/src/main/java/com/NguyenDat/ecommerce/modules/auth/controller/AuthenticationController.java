package com.NguyenDat.ecommerce.modules.auth.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.auth.dto.request.AuthenticationRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.IntrospectRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.LogoutRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.RefreshTokenRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.modules.auth.dto.response.IntrospectResponse;
import com.NguyenDat.ecommerce.modules.auth.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping(value = "/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping(value = "/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        AuthenticationResponse result = authenticationService.authenticate(request);
        return ApiResponse.of(ResponseCode.LOGIN_SUCCESS, result);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logOut(@RequestBody @Valid LogoutRequest token) {
        authenticationService.logOut(token);
        return ApiResponse.of(ResponseCode.LOGOUT_SUCCESS, null);
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        return ApiResponse.of(ResponseCode.LOGIN_SUCCESS, authenticationService.refreshToken(request));
    }

    @PostMapping(value = "/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody @Valid IntrospectRequest request) {
        return ApiResponse.of(ResponseCode.INTROSPECT_SUCCESS, authenticationService.introspect(request));
    }
}
