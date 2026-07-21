package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.auth.ChangePasswordRequest;
import com.nguyendat.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.nguyendat.ecommerce.dto.request.auth.ResetPasswordRequest;
import com.nguyendat.ecommerce.entity.PasswordResetToken;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.Active;
import com.nguyendat.ecommerce.repository.PasswordResetTokenRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.impl.PasswordManagementServiceImpl;

@ExtendWith(MockitoExtension.class)
class PasswordManagementServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    EmailService emailService;

    @org.mockito.Spy
    java.time.Clock clock = java.time.Clock.systemDefaultZone();

    @Mock
    CurrentUserService currentUserService;

    @InjectMocks
    PasswordManagementServiceImpl passwordManagementService;

    User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("customer@example.com")
                .password("encoded-old-password")
                .fullName("Customer")
                .phoneNumber("0901234567")
                .status(Active.ACTIVE)
                .deleted(false)
                .tokenVersion(0L)
                .build();
        ReflectionTestUtils.setField(passwordManagementService, "resetCodeExpiryMinutes", 10L);
        ReflectionTestUtils.setField(passwordManagementService, "maxResetCodeAttempts", 5);
        ReflectionTestUtils.setField(passwordManagementService, "resetCodeResendCooldownSeconds", 60L);
        ReflectionTestUtils.setField(passwordManagementService, "maxResetCodeRequests", 3);
        ReflectionTestUtils.setField(passwordManagementService, "resetCodeRequestWindowMinutes", 15L);
    }

    @Test
    void changePassword_updatesPasswordAndInvalidatesExistingTokens_whenCurrentPasswordMatches() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("OldPassword@1")
                .newPassword("NewPassword@1")
                .confirmPassword("NewPassword@1")
                .build();
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(passwordEncoder.matches("OldPassword@1", "encoded-old-password")).thenReturn(true);
        when(passwordEncoder.encode("NewPassword@1")).thenReturn("encoded-new-password");

        passwordManagementService.changePassword(request);

        assertEquals("encoded-new-password", user.getPassword());
        assertEquals(1L, user.getTokenVersion());
        verify(userRepository).save(user);
    }

    @Test
    void requestPasswordReset_sendsSixDigitCodeAndStoresOnlyItsHash_whenEmailExists() {
        when(userRepository.findByEmailAndDeletedFalse("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.findTopByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(any(String.class))).thenReturn("encoded-reset-code");

        passwordManagementService.requestPasswordReset(
                ForgotPasswordRequest.builder().email("customer@example.com").build());

        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetCode(eq("customer@example.com"), codeCaptor.capture());
        assertEquals(6, codeCaptor.getValue().length());
        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void requestPasswordReset_keepsGenericSuccessBehavior_whenEmailDoesNotExist() {
        when(userRepository.findByEmailAndDeletedFalse("unknown@example.com")).thenReturn(Optional.empty());

        passwordManagementService.requestPasswordReset(
                ForgotPasswordRequest.builder().email("unknown@example.com").build());

        verify(emailService, never()).sendPasswordResetCode(any(String.class), any(String.class));
        verify(passwordResetTokenRepository, never()).save(any(PasswordResetToken.class));
    }

    @Test
    void resetPassword_marksCodeUsedAndInvalidatesExistingTokens_whenCodeIsValid() {
        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .email("customer@example.com")
                .code("123456")
                .newPassword("NewPassword@1")
                .confirmPassword("NewPassword@1")
                .build();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .id(10L)
                .user(user)
                .codeHash("encoded-reset-code")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .attemptCount(0)
                .build();
        when(userRepository.findByEmailAndDeletedFalse("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(1L))
                .thenReturn(Optional.of(resetToken));
        when(passwordEncoder.matches("123456", "encoded-reset-code")).thenReturn(true);
        when(passwordEncoder.encode("NewPassword@1")).thenReturn("encoded-new-password");

        passwordManagementService.resetPassword(request);

        assertEquals("encoded-new-password", user.getPassword());
        assertEquals(1L, user.getTokenVersion());
        assertEquals(0, resetToken.getAttemptCount());
        assertNotNull(resetToken.getUsedAt());
        verify(userRepository).save(user);
        verify(passwordResetTokenRepository).invalidateUnusedTokensByUserId(eq(1L), any(LocalDateTime.class));
    }

    @Test
    void resetPassword_rejectsExpiredCode() {
        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .email("customer@example.com")
                .code("123456")
                .newPassword("NewPassword@1")
                .confirmPassword("NewPassword@1")
                .build();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .codeHash("encoded-reset-code")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .attemptCount(0)
                .build();
        when(userRepository.findByEmailAndDeletedFalse("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(1L))
                .thenReturn(Optional.of(resetToken));

        AppException exception =
                assertThrows(AppException.class, () -> passwordManagementService.resetPassword(request));

        assertEquals(ErrorCode.PASSWORD_RESET_CODE_EXPIRED, exception.getErrorCode());
    }

    @Test
    void resetPassword_incrementsAttemptCount_whenCodeIsIncorrect() {
        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .email("customer@example.com")
                .code("123456")
                .newPassword("NewPassword@1")
                .confirmPassword("NewPassword@1")
                .build();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .codeHash("encoded-reset-code")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .attemptCount(0)
                .build();
        when(userRepository.findByEmailAndDeletedFalse("customer@example.com")).thenReturn(Optional.of(user));
        when(passwordResetTokenRepository.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(1L))
                .thenReturn(Optional.of(resetToken));
        when(passwordEncoder.matches("123456", "encoded-reset-code")).thenReturn(false);

        AppException exception =
                assertThrows(AppException.class, () -> passwordManagementService.resetPassword(request));

        assertEquals(ErrorCode.PASSWORD_RESET_CODE_INVALID, exception.getErrorCode());
        assertEquals(1, resetToken.getAttemptCount());
        verify(passwordResetTokenRepository).save(resetToken);
    }
}

