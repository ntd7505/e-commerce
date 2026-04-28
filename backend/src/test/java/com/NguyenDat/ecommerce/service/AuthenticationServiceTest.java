package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.auth.dto.request.AuthenticationRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.IntrospectRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.request.RefreshTokenRequest;
import com.NguyenDat.ecommerce.modules.auth.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.modules.auth.dto.response.IntrospectResponse;
import com.NguyenDat.ecommerce.modules.auth.entity.InvalidatedToken;
import com.NguyenDat.ecommerce.modules.auth.repository.InvalidatedTokenRepository;
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

    @Mock
    InvalidatedTokenRepository invalidatedTokenRepository;

    @InjectMocks
    AuthenticationService authenticationService;

    AuthenticationRequest authenticationRequest;
    IntrospectRequest introspectRequest;
    RefreshTokenRequest refreshTokenRequest;
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

        refreshTokenRequest =
                RefreshTokenRequest.builder().refreshToken("dummy-token").build();

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
        assertNotNull(result.getAccessToken());
        assertNotNull(result.getRefreshToken());
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
        introspectRequest.setToken(authenticationResponse.getAccessToken());
        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        IntrospectResponse result = authenticationService.introspect(introspectRequest);

        assertTrue(result.isValid());
        assertNotNull(authenticationResponse.getAccessToken());
        verify(userRepository).findByEmail("admin@gmail.com");
        verify(passwordEncoder).matches("123456", user.getPassword());
        verify(invalidatedTokenRepository).existsById(anyString());
    }

    @Test
    void introspect_shouldThrowException_whenTokenIsInvalid() {
        introspectRequest.setToken("invalid-token");
        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.introspect(introspectRequest));
        assertEquals(ErrorCode.TOKEN_INVALID, exception.getErrorCode());
    }

    @Test
    void refreshToken_shouldReturnNewTokens_whenRefreshTokenIsValid() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse loginResponse = authenticationService.authenticate(authenticationRequest);
        refreshTokenRequest.setRefreshToken(loginResponse.getRefreshToken());

        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        when(userRepository.findByEmailAndDeletedFalse("admin@gmail.com")).thenReturn(Optional.of(user));

        AuthenticationResponse result = authenticationService.refreshToken(refreshTokenRequest);

        assertNotNull(result);
        assertNotNull(result.getAccessToken());
        assertNotNull(result.getRefreshToken());
        assertNotEquals(loginResponse.getAccessToken(), result.getAccessToken());
        assertNotEquals(loginResponse.getRefreshToken(), result.getRefreshToken());
        assertTrue(result.isAuthenticated());

        verify(invalidatedTokenRepository).existsById(anyString());
        verify(userRepository).findByEmailAndDeletedFalse("admin@gmail.com");
        verify(invalidatedTokenRepository).save(any(InvalidatedToken.class));
    }

    @Test
    void refreshToken_shouldBlacklistOldRefreshToken_whenRefreshTokenIsValid() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse loginResponse = authenticationService.authenticate(authenticationRequest);
        refreshTokenRequest.setRefreshToken(loginResponse.getRefreshToken());

        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        when(userRepository.findByEmailAndDeletedFalse("admin@gmail.com")).thenReturn(Optional.of(user));

        authenticationService.refreshToken(refreshTokenRequest);

        ArgumentCaptor<InvalidatedToken> captor = ArgumentCaptor.forClass(InvalidatedToken.class);
        verify(invalidatedTokenRepository).save(captor.capture());

        assertNotNull(captor.getValue().getId());
        assertNotNull(captor.getValue().getExpiryTime());
    }

    @Test
    void refreshToken_shouldThrowException_whenTokenIsAccessToken() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse loginResponse = authenticationService.authenticate(authenticationRequest);
        refreshTokenRequest.setRefreshToken(loginResponse.getAccessToken());

        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.refreshToken(refreshTokenRequest));

        assertEquals(ErrorCode.TOKEN_INVALID, exception.getErrorCode());
        verify(invalidatedTokenRepository, never()).save(any());
    }

    @Test
    void refreshToken_shouldThrowException_whenRefreshTokenIsBlacklisted() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse loginResponse = authenticationService.authenticate(authenticationRequest);
        refreshTokenRequest.setRefreshToken(loginResponse.getRefreshToken());

        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(true);

        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.refreshToken(refreshTokenRequest));

        assertEquals(ErrorCode.TOKEN_BLACKLISTED, exception.getErrorCode());
        verify(userRepository, never()).findByEmailAndDeletedFalse(anyString());
        verify(invalidatedTokenRepository, never()).save(any());
    }

    @Test
    void refreshToken_shouldThrowException_whenUserIsInactive() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", user.getPassword())).thenReturn(true);

        AuthenticationResponse loginResponse = authenticationService.authenticate(authenticationRequest);
        refreshTokenRequest.setRefreshToken(loginResponse.getRefreshToken());

        user.setStatus(Active.INACTIVE);
        when(invalidatedTokenRepository.existsById(anyString())).thenReturn(false);
        when(userRepository.findByEmailAndDeletedFalse("admin@gmail.com")).thenReturn(Optional.of(user));

        AppException exception =
                assertThrows(AppException.class, () -> authenticationService.refreshToken(refreshTokenRequest));

        assertEquals(ErrorCode.USER_INACTIVE, exception.getErrorCode());
        verify(invalidatedTokenRepository, never()).save(any());
    }
}
