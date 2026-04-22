package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.role.entity.Role;
import com.NguyenDat.ecommerce.modules.role.repository.RoleRepository;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserCreationRequest;
import com.NguyenDat.ecommerce.modules.user.dto.request.UserUpdateRequest;
import com.NguyenDat.ecommerce.modules.user.dto.response.UserResponse;
import com.NguyenDat.ecommerce.modules.user.entity.User;
import com.NguyenDat.ecommerce.modules.user.enums.Active;
import com.NguyenDat.ecommerce.modules.user.mapper.UserMapper;
import com.NguyenDat.ecommerce.modules.user.repository.UserRepository;
import com.NguyenDat.ecommerce.modules.user.service.UserService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserServiceTest {
    @Mock
    UserRepository userRepository;

    @Mock
    RoleRepository roleRepository;

    @Mock
    UserMapper userMapper;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    UserCreationRequest userCreationRequest;
    UserUpdateRequest userUpdateRequest;
    Role role;
    User user;
    UserResponse userResponse;

    @BeforeEach
    void setUp() {
        userCreationRequest = UserCreationRequest.builder()
                .email("dat@gmail.com")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .build();

        userUpdateRequest = UserUpdateRequest.builder()
                .fullName("Nguyen Dat Updated")
                .phoneNumber("0987654321")
                .avatarUrl("updated-avatar.png")
                .build();

        role = Role.builder().name("USER").description("Default user role").build();

        user = User.builder()
                .id(1L)
                .email("dat@gmail.com")
                .password("encoded-password")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .status(Active.ACTIVE)
                .deleted(false)
                .roles(Set.of(role))
                .build();

        userResponse = UserResponse.builder()
                .email("dat@gmail.com")
                .fullName("Nguyen Dat")
                .phoneNumber("0912345678")
                .avatarUrl("avatar.png")
                .roles(Set.of())
                .build();
    }

    @Test
    void createUser_shouldReturnUserResponse_whenRequestIsValid() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.createUser(userCreationRequest);
        assertEquals("dat@gmail.com", result.getEmail());
        assertEquals("Nguyen Dat", result.getFullName());
        assertEquals("0912345678", result.getPhoneNumber());
        assertEquals("avatar.png", result.getAvatarUrl());

        verify(userRepository).existsByEmail("dat@gmail.com");
        verify(userRepository).existsByPhoneNumber("0912345678");
        verify(passwordEncoder).encode("Dat@1234");
        verify(roleRepository).findById("USER");
        verify(userRepository).save(user);
    }

    @Test
    void createUser_shouldThrowException_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(true);
        AppException exception = assertThrows(AppException.class, () -> userService.createUser(userCreationRequest));
        assertEquals(ErrorCode.EMAIL_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_shouldThrowException_whenPhoneAlreadyExists() {
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(true);
        AppException exception = assertThrows(AppException.class, () -> userService.createUser(userCreationRequest));
        assertEquals(ErrorCode.PHONE_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_shouldAssignUserRole_whenRolesIsNull() {
        userCreationRequest.setRoles(null);
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.createUser(userCreationRequest);
        assertEquals(Set.of(role), user.getRoles());
        assertEquals("encoded-password", user.getPassword());
        assertEquals("dat@gmail.com", result.getEmail());
        assertEquals("Nguyen Dat", result.getFullName());
        assertEquals("0912345678", result.getPhoneNumber());
        assertEquals("avatar.png", result.getAvatarUrl());

        verify(userRepository).existsByEmail("dat@gmail.com");
        verify(userRepository).existsByPhoneNumber("0912345678");
        verify(passwordEncoder).encode("Dat@1234");
        verify(roleRepository).findById("USER");
        verify(userRepository).save(user);
    }

    @Test
    void createUser_shouldThrowException_whenRoleNotFound() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> userService.createUser(userCreationRequest));
        assertEquals(ErrorCode.ROLE_NOT_FOUND, exception.getErrorCode());
        verify(roleRepository).findById("USER");
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUserById_shouldReturnUserResponse_whenRequestIsValid() {
        UserResponse updatedUserResponse = UserResponse.builder()
                .email("dat@gmail.com")
                .fullName("Nguyen Dat Updated")
                .phoneNumber("0987654321")
                .avatarUrl("updated-avatar.png")
                .roles(Set.of())
                .build();

        when(userRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByPhoneNumberAndIdNot(userUpdateRequest.getPhoneNumber(), 1L))
                .thenReturn(false);
        doAnswer(invocation -> {
                    user.setFullName(userUpdateRequest.getFullName());
                    user.setPhoneNumber(userUpdateRequest.getPhoneNumber());
                    user.setAvatarUrl(userUpdateRequest.getAvatarUrl());
                    return null;
                })
                .when(userMapper)
                .updateUserMapper(user, userUpdateRequest);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(updatedUserResponse);

        UserResponse result = userService.updateUserById(1L, userUpdateRequest);

        assertEquals("Nguyen Dat Updated", user.getFullName());
        assertEquals("0987654321", user.getPhoneNumber());
        assertEquals("updated-avatar.png", user.getAvatarUrl());
        assertEquals("Nguyen Dat Updated", result.getFullName());
        assertEquals("0987654321", result.getPhoneNumber());
        assertEquals("updated-avatar.png", result.getAvatarUrl());
        verify(userRepository).save(user);
    }

    @Test
    void updateUserById_shouldThrowException_whenPhoneAlreadyExists() {
        when(userRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByPhoneNumberAndIdNot(userUpdateRequest.getPhoneNumber(), 1L))
                .thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> userService.updateUserById(1L, userUpdateRequest));
        assertEquals(ErrorCode.PHONE_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
        verify(userMapper, never()).updateUserMapper(any(), any());
    }

    @Test
    void updateUserById_shouldThrowException_whenUserIsDeleted() {
        when(userRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception =
                assertThrows(AppException.class, () -> userService.updateUserById(1L, userUpdateRequest));
        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
        verify(userMapper, never()).updateUserMapper(any(), any());
    }

    @Test
    void softDeleteUser_shouldMarkUserAsDeleted_whenUserExists() {
        when(userRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.softDeleteUser(1L);

        assertTrue(user.isDeleted());
        verify(userRepository).save(user);
    }

    @Test
    void softDeleteUser_shouldThrowException_whenUserIsNotVisible() {
        when(userRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());
        AppException exception = assertThrows(AppException.class, () -> userService.softDeleteUser(1L));
        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void getAllUsers_shouldReturnRepositoryResults() {
        User inactiveUser = User.builder()
                .id(3L)
                .email("inactive@gmail.com")
                .fullName("Inactive User")
                .phoneNumber("0888888888")
                .status(Active.INACTIVE)
                .deleted(false)
                .build();

        UserResponse inactiveResponse = UserResponse.builder()
                .fullName("Inactive User")
                .phoneNumber("0888888888")
                .email("inactive@gmail.com")
                .build();

        when(userRepository.findAllByDeletedFalse()).thenReturn(List.of(user, inactiveUser));
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);
        when(userMapper.toUserResponse(inactiveUser)).thenReturn(inactiveResponse);

        List<UserResponse> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals(userResponse.getFullName(), result.getFirst().getFullName());
        assertEquals(userResponse.getPhoneNumber(), result.getFirst().getPhoneNumber());
        assertEquals(userResponse.getAvatarUrl(), result.getFirst().getAvatarUrl());
        assertEquals(userResponse.getEmail(), result.getFirst().getEmail());

        verify(userRepository).findAllByDeletedFalse();
        verify(userMapper).toUserResponse(user);
        verify(userMapper).toUserResponse(inactiveUser);
    }
}
