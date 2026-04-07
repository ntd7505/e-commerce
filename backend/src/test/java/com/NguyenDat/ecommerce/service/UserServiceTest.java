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
    void createNewUsers_shouldReturnUserResponse_whenRequestIsValid() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toStaffResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.createNewUsers(userCreationRequest);
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
    void createNewUsers_shouldThrowException_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> userService.createNewUsers(userCreationRequest));
        assertEquals(ErrorCode.EMAIL_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createNewUsers_shouldThrowException_whenPhoneAlreadyExists() {
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> userService.createNewUsers(userCreationRequest));
        assertEquals(ErrorCode.PHONE_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createNewUsers_shouldAssignUserRole_whenRolesIsNull() {
        userCreationRequest.setRoles(null);
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toStaffResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.createNewUsers(userCreationRequest);
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
    void createNewUsers_shouldThrowException_whenRoleNotFound() {
        when(userRepository.existsByEmail("dat@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("0912345678")).thenReturn(false);
        when(userMapper.toUser(userCreationRequest)).thenReturn(user);
        when(passwordEncoder.encode("Dat@1234")).thenReturn("encoded-password");
        when(roleRepository.findById("USER")).thenReturn(Optional.empty());
        AppException exception =
                assertThrows(AppException.class, () -> userService.createNewUsers(userCreationRequest));
        assertEquals(ErrorCode.ROLE_NOT_FOUND, exception.getErrorCode());
        verify(roleRepository).findById("USER");
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateStaffById_shouldReturnUserResponse_whenRequestIsValid() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
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
        when(userMapper.toStaffResponse(user)).thenReturn(userResponse);

        UserResponse result = userService.updateStaffById(1L, userUpdateRequest);

        assertEquals("Nguyen Dat", result.getFullName());
        assertEquals("0912345678", result.getPhoneNumber());
        assertEquals("avatar.png", result.getAvatarUrl());
        verify(userRepository).save(user);
    }

    @Test
    void updateStaffById_shouldThrowException_whenPhoneAlreadyExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByPhoneNumberAndIdNot(userUpdateRequest.getPhoneNumber(), 1L))
                .thenReturn(true);
        AppException exception =
                assertThrows(AppException.class, () -> userService.updateStaffById(1L, userUpdateRequest));
        assertEquals(ErrorCode.PHONE_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
        verify(userMapper, never()).updateUserMapper(any(), any());
    }

    @Test
    void updateStaffById_shouldThrowException_whenUserIsDeleted() {
        user.setDeleted(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        AppException exception =
                assertThrows(AppException.class, () -> userService.updateStaffById(1L, userUpdateRequest));
        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
        verify(userMapper, never()).updateUserMapper(any(), any());
    }

    @Test
    void deleteStaff_shouldMarkUserAsDeleted_whenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.deleteStaff(1L);

        assertTrue(user.isDeleted());
        verify(userRepository).save(user);
    }

    @Test
    void deleteStaff_shouldThrowException_whenUserAlreadyDeleted() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        user.setDeleted(true);
        AppException exception = assertThrows(AppException.class, () -> userService.deleteStaff(1L));
        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void getAllUsers_shouldReturnOnlyActiveNonDeletedUsers() {
        User deletedUser = User.builder()
                .id(2L)
                .email("deleted@gmail.com")
                .fullName("Deleted User")
                .phoneNumber("0999999999")
                .status(Active.ACTIVE)
                .deleted(true)
                .build();

        User inactiveUser = User.builder()
                .id(3L)
                .email("inactive@gmail.com")
                .fullName("Inactive User")
                .phoneNumber("0888888888")
                .status(Active.INACTIVE)
                .deleted(false)
                .build();
        when(userRepository.findAll()).thenReturn(List.of(user, deletedUser, inactiveUser));
        when(userMapper.toStaffResponse(user)).thenReturn(userResponse);
        List<UserResponse> result = userService.getAllUsers();
        assertEquals(1, result.size());
        assertEquals(result.getFirst().getFullName(), userResponse.getFullName());
        assertEquals(result.getFirst().getPhoneNumber(), userResponse.getPhoneNumber());
        assertEquals(result.getFirst().getAvatarUrl(), userResponse.getAvatarUrl());
        assertEquals(result.getFirst().getEmail(), userResponse.getEmail());

        verify(userMapper).toStaffResponse(user);
        verify(userMapper, never()).toStaffResponse(deletedUser);
        verify(userMapper, never()).toStaffResponse(inactiveUser);
    }
}
