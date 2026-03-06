package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.constant.ApiConstant;
import com.NguyenDat.ecommerce.constant.ResponseCode;
import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.response.UserResponse;
import com.NguyenDat.ecommerce.service.UserService;

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
    public ApiResponse<UserResponse> createStaff(@RequestBody @Valid UserCreationRequest staff) {
        return ApiResponse.of(ResponseCode.USER_CREATED, this.userService.createNewUsers(staff));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<UserResponse> getUserById(@PathVariable int userId) {
        return ApiResponse.of(ResponseCode.USER_FETCHED, userService.getUserById(userId));
    }

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUser() {
        return ApiResponse.ofList(ResponseCode.USERS_FETCHED, userService.getAllUsers());
    }

    @PutMapping(value = "/users/{userId}")
    public ApiResponse<UserResponse> updateStaffById(
            @PathVariable int userId, @RequestBody UserUpdateRequest userUpdateRequest) {
        return ApiResponse.of(
                ResponseCode.USER_UPDATED, this.userService.updateStaffById(userId, userUpdateRequest));
    }

    @DeleteMapping(value = "/users/{userId}")
    public ApiResponse<UserResponse> deleteStaff(@PathVariable long userId) {
        userService.deleteStaff(userId);
        return ApiResponse.of(ResponseCode.USER_DELETED, null);
    }
}
