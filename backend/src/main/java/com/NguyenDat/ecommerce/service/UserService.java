package com.NguyenDat.ecommerce.service;

import java.util.List;

import jakarta.validation.Valid;

import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateStatusRequest;
import com.NguyenDat.ecommerce.dto.request.auth.UserRegisterRequest;
import com.NguyenDat.ecommerce.dto.response.UserResponse;

public interface UserService {
    UserResponse createUser(UserCreationRequest userCreationRequest);

    UserResponse getMyInfo();

    UserResponse getUserById(long id);

    List<UserResponse> getAllUsers();

    UserResponse updateUserById(long id, UserUpdateRequest userUpdateRequest);

    void softDeleteUser(long id);

    List<UserResponse> getDeletedUsers();

    UserResponse updateUserStatusById(Long id, UserUpdateStatusRequest userUpdateStatusRequest);

    UserResponse register(@Valid UserRegisterRequest request);

    UserResponse updateMyInfo(UserUpdateRequest userUpdateRequest);
}
