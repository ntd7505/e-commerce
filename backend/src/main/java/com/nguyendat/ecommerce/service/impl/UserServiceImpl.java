package com.nguyendat.ecommerce.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.dto.response.PageResponse;
import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.UserCreationRequest;
import com.nguyendat.ecommerce.dto.request.UserUpdateRequest;
import com.nguyendat.ecommerce.dto.request.UserUpdateStatusRequest;
import com.nguyendat.ecommerce.dto.request.auth.UserRegisterRequest;
import com.nguyendat.ecommerce.dto.response.UserResponse;
import com.nguyendat.ecommerce.entity.Role;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.Active;
import com.nguyendat.ecommerce.mapper.UserMapper;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.UserService;

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
    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);

        Set<String> roleNames =
                request.getRoles() == null || request.getRoles().isEmpty() ? Set.of("CUSTOMER") : request.getRoles();

        return createUserInternal(user, request.getPassword(), roleNames);
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

    @Override
    public PageResponse<UserResponse> getDeletedUsersInPage(Pageable pageable) {
        Page<User> page = userRepository.findAllByDeletedTrue(pageable);
        return PageResponse.from(page.map(userMapper::toUserResponse));
    }

    @Transactional
    public UserResponse updateUserStatusById(Long id, @Valid UserUpdateStatusRequest userUpdateStatusRequest) {
        User user = this.userRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(userUpdateStatusRequest.getStatus());
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    @Override
    public UserResponse register(UserRegisterRequest request) {
        User user = userMapper.toUser(request);
        return createUserInternal(user, request.getPassword(), Set.of("CUSTOMER"));
    }

    @Override
    @Transactional
    public UserResponse updateMyInfo(UserUpdateRequest userUpdateRequest) {
        var context = SecurityContextHolder.getContext();
        String email = Objects.requireNonNull(context.getAuthentication()).getName();
        User user = userRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (userRepository.existsByPhoneNumberAndIdNot(userUpdateRequest.getPhoneNumber(), user.getId())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        userMapper.updateUserMapper(user, userUpdateRequest);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public PageResponse<UserResponse> getUsersInPage(Pageable pageable) {
        Page<User> page = userRepository.findAllByDeletedFalse(pageable);
        return PageResponse.from(page.map(userMapper::toUserResponse));
    }

    private UserResponse createUserInternal(User user, String rawPassword, Set<String> roleNames) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        Set<Role> roles = roleNames.stream()
                .map(roleName ->
                        roleRepository.findById(roleName).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)))
                .collect(Collectors.toSet());

        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRoles(roles);
        user.setStatus(Active.ACTIVE);
        user.setDeleted(false);

        try {
            return userMapper.toUserResponse(userRepository.save(user));
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }
}

