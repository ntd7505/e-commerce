package com.nguyendat.ecommerce.controller.client;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyendat.ecommerce.common.constant.ApiConstant;
import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.dto.response.ApiResponse;
import com.nguyendat.ecommerce.dto.request.UserUpdateRequest;
import com.nguyendat.ecommerce.dto.request.auth.ChangePasswordRequest;
import com.nguyendat.ecommerce.dto.request.auth.UserRegisterRequest;
import com.nguyendat.ecommerce.dto.response.UserResponse;
import com.nguyendat.ecommerce.service.PasswordManagementService;
import com.nguyendat.ecommerce.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientUserController {

    UserService userService;
    PasswordManagementService passwordManagementService;

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody @Valid UserRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.USER_CREATED, userService.register(request)));
    }

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo() {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.USER_FETCHED, userService.getMyInfo()));
    }

    @PatchMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyInfo(
            @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.USER_UPDATED, userService.updateMyInfo(userUpdateRequest)));
    }

    @PatchMapping("/users/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        passwordManagementService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PASSWORD_CHANGED, null));
    }
}

