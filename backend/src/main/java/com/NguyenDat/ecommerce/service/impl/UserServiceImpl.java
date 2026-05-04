package com.NguyenDat.ecommerce.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateStatusRequest;
import com.NguyenDat.ecommerce.dto.response.UserResponse;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.Active;
import com.NguyenDat.ecommerce.mapper.UserMapper;
import com.NguyenDat.ecommerce.repository.RoleRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(UserCreationRequest userCreationRequest) {
        if (userRepository.existsByEmail(userCreationRequest.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhoneNumber(userCreationRequest.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }
        User user = userMapper.toUser(userCreationRequest);
        user.setPassword(passwordEncoder.encode(userCreationRequest.getPassword()));
        if (userCreationRequest.getRoles() == null
                || userCreationRequest.getRoles().isEmpty()) {
            Role role = roleRepository.findById("USER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            user.setRoles(Set.of(role));
        } else {
            Set<Role> roles = userCreationRequest.getRoles().stream()
                    .map(roleName -> roleRepository
                            .findById(roleName)
                            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return userMapper.toUserResponse(user);
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String email = Objects.requireNonNull(context.getAuthentication()).getName();
        User user = userRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @PostAuthorize("hasRole('ADMIN') or returnObject.email == authentication.name ")
    public UserResponse getUserById(long id) {
        User user = userRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByDeletedFalse().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUserById(long id, UserUpdateRequest userUpdateRequest) {
        User user = this.userRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (userRepository.existsByPhoneNumberAndIdNot(userUpdateRequest.getPhoneNumber(), id)) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }
        userMapper.updateUserMapper(user, userUpdateRequest);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void softDeleteUser(long id) {
        User user = this.userRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setDeleted(true);
        user.setStatus(Active.INACTIVE);
        this.userRepository.save(user);
    }

    public List<UserResponse> getDeletedUsers() {
        return userRepository.findAllByDeletedTrue().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUserStatusById(Long id, @Valid UserUpdateStatusRequest userUpdateStatusRequest) {
        User user = this.userRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(userUpdateStatusRequest.getStatus());
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
