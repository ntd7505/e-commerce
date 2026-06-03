package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateStatusRequest;
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
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @RequestBody @Valid UserCreationRequest userCreationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.USER_CREATED, this.userService.createUser(userCreationRequest)));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.USER_FETCHED, userService.getUserById(userId)));
    }

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo() {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.USER_FETCHED, userService.getMyInfo()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getUsersPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.USERS_FETCHED, userService.getUsersInPage(pageRequest.toPageable())));
    }

    @GetMapping("/users/deleted")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getDeletedUsersPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.DELETED_USERS_FETCHED, userService.getDeletedUsersInPage(pageRequest.toPageable())));
    }

    @GetMapping("/users/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.USERS_FETCHED, userService.getAllUsers()));
    }

    @GetMapping("/users/deleted/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getDeletedUsers() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.DELETED_USERS_FETCHED, userService.getDeletedUsers()));
    }

    @PatchMapping(value = "/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserById(
            @PathVariable Long userId, @RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.USER_UPDATED, this.userService.updateUserById(userId, userUpdateRequest)));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatusById(
            @PathVariable Long id, @RequestBody @Valid UserUpdateStatusRequest userUpdateStatusRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.USER_STATUS_UPDATED, userService.updateUserStatusById(id, userUpdateStatusRequest)));
    }

    @DeleteMapping(value = "/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> softDeleteUser(@PathVariable Long userId) {
        userService.softDeleteUser(userId);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.USER_DELETED, null));
    }
}
