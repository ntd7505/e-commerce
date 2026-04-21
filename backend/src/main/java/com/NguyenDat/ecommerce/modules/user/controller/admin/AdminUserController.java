package com.NguyenDat.ecommerce.modules.user.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserUpdateStatusRequest;
import com.NguyenDat.ecommerce.modules.user.dto.response.UserResponse;
import com.NguyenDat.ecommerce.modules.user.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminUserController {

    UserService userService;

    @PostMapping("/users")
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest userCreationRequest) {
        return ApiResponse.of(ResponseCode.USER_CREATED, this.userService.createUser(userCreationRequest));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long userId) {
        return ApiResponse.of(ResponseCode.USER_FETCHED, userService.getUserById(userId));
    }

    @GetMapping("/users/me")
    public ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.of(ResponseCode.USER_FETCHED, userService.getMyInfo());
    }

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.ofList(ResponseCode.USERS_FETCHED, userService.getAllUsers());
    }

    @GetMapping("/users/deleted")
    public ApiResponse<List<UserResponse>> getDeletedUsers() {
        return ApiResponse.ofList(ResponseCode.DELETED_USERS_FETCHED, userService.getDeletedUsers());
    }

    @PutMapping(value = "/users/{userId}")
    public ApiResponse<UserResponse> updateUserById(
            @PathVariable Long userId, @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        return ApiResponse.of(ResponseCode.USER_UPDATED, this.userService.updateUserById(userId, userUpdateRequest));
    }

    @PatchMapping("/users/{id}/status")
    public ApiResponse<UserResponse> updateUserStatusById(
            @PathVariable Long id, @RequestBody @Valid UserUpdateStatusRequest userUpdateStatusRequest) {
        return ApiResponse.of(
                ResponseCode.USER_STATUS_UPDATED, userService.updateUserStatusById(id, userUpdateStatusRequest));
    }

    @DeleteMapping(value = "/users/{userId}")
    public ApiResponse<UserResponse> softDeleteUser(@PathVariable Long userId) {
        userService.softDeleteUser(userId);
        return ApiResponse.of(ResponseCode.USER_DELETED, null);
    }
}
