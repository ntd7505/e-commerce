package com.NguyenDat.ecommerce.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.UserResponse;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.exception.AppException;
import com.NguyenDat.ecommerce.exception.ErrorCode;
import com.NguyenDat.ecommerce.mapper.UserMapper;
import com.NguyenDat.ecommerce.repository.RoleRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse createNewUsers(UserCreationRequest userCreationRequest) {
        User user = userMapper.toUser(userCreationRequest);
        user.setPassword(passwordEncoder.encode(userCreationRequest.getPassword()));
        if (userCreationRequest.getRoles() == null) {
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
        return userMapper.toStaffResponse(user);
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String email = Objects.requireNonNull(context.getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toStaffResponse(user);
    }

    @PostAuthorize("hasRole('ADMIN') or returnObject.email == authentication.name ")
    public UserResponse getUserById(long id) {
        log.info("getUserById called - id: {}", id);

        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        log.info("returnObject email: {}", user.getEmail());
        return userMapper.toStaffResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream()
                .map(userMapper::toStaffResponse)
                .toList();
    }

    public UserResponse updateStaffById(long id, UserUpdateRequest userUpdateRequest) {
        User user = this.userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.updateUserMapper(user, userUpdateRequest);
        return userMapper.toStaffResponse(userRepository.save(user));
    }

    public void deleteStaff(long id) {
        User user = this.userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (user.isDeleted()) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        user.setDeleted(true);
        this.userRepository.save(user);
    }
}
