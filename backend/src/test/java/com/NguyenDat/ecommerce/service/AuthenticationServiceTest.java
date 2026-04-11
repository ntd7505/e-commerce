package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.auth.dto.request.AuthenticationRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.IntrospectRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.modules.auth.dto.response.IntrospectResponse;
import com.NguyenDat.ecommerce.modules.auth.service.AuthenticationService;
import com.NguyenDat.ecommerce.modules.permission.entity.Permission;
import com.NguyenDat.ecommerce.modules.role.entity.Role;
import com.NguyenDat.ecommerce.modules.user.entity.User;
import com.NguyenDat.ecommerce.modules.user.enums.Active;
import com.NguyenDat.ecommerce.modules.user.repository.UserRepository;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    AuthenticationService authenticationService;

    AuthenticationRequest authenticationRequest;
    IntrospectRequest introspectRequest;
    User user;
    Role role;
    Permission permission;

    @BeforeEach
    void setUp() {
        permission = Permission.builder()
                .name("brand:create")
                .description("Create brand")
                .build();

        role = Role.builder()
                .name("ADMIN")
                .description("Admin role")
                .permissions(Set.of(permission))
                .build();

        user = User.builder()
                .id(1L)
                .email("admin@gmail.com")
                .password("123456")
                .fullName("Admin")
                .status(Active.ACTIVE)
                .deleted(false)
                .roles(Set.of(role))
                .build();

        authenticationRequest = AuthenticationRequest.builder()
                .email("admin@gmail.com")
                .password("123456")
                .build();

        introspectRequest = IntrospectRequest.builder().token("dummy-token").build();

        ReflectionTestUtils.setField(
                authenticationService,
                "SIGNER_KEY",
                "1234567890123456789012345678901234567890123456789012345678901234");
    }

    @Test
    void authenticate_shouldReturnToken_whenRequestIsValid() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);
        AuthenticationResponse result = authenticationService.authenticate(authenticationRequest);
        assertNotNull(result);
        assertNotNull(result.getToken());
        assertTrue(result.isAuthenticated());
        verify(userRepository).findByEmail("admin@gmail.com");
    }

    @Test
    void authenticate_shouldThrowException_whenUserNotFound() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.empty());
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.authenticate(authenticationRequest));
        assertEquals(ErrorCode.USER_NOT_EXISTED, exception.getErrorCode());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void authenticate_shouldThrowException_whenPasswordIsWrong() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(false);
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.authenticate(authenticationRequest));
        assertEquals(ErrorCode.UNAUTHENTICATED, exception.getErrorCode());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder).matches("123456", user.getPassword());
    }

    @Test
    void authenticate_shouldThrowException_whenUserIsInactive() {
        user.setStatus(Active.INACTIVE);
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.authenticate(authenticationRequest));
        assertEquals(ErrorCode.USER_INACTIVE, exception.getErrorCode());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void authenticate_shouldThrowException_whenUserIsDeleted() {
        user.setDeleted(true);
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.authenticate(authenticationRequest));
        assertEquals(ErrorCode.USER_DELETED, exception.getErrorCode());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void introspect_shouldReturnValidTrue_whenTokenIsValid() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse authenticationResponse = authenticationService.authenticate(authenticationRequest);
        introspectRequest.setToken(authenticationResponse.getToken());
        IntrospectResponse result = authenticationService.introspect(introspectRequest);

        assertTrue(result.isValid());
        assertNotNull(authenticationResponse.getToken());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder).matches("123456", user.getPassword());
    }

    @Test
    void introspect_shouldThrowException_whenTokenIsInvalid() {
        introspectRequest.setToken("invalid-token");
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.introspect(introspectRequest));
        assertEquals(ErrorCode.TOKEN_INVALID, exception.getErrorCode());
    }
}
