package com.NguyenDat.ecommerce.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.auth.ChangePasswordRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ResetPasswordRequest;
import com.NguyenDat.ecommerce.entity.PasswordResetToken;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.repository.PasswordResetTokenRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.CurrentUserService;
import com.NguyenDat.ecommerce.service.EmailService;
import com.NguyenDat.ecommerce.service.PasswordManagementService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordManagementServiceImpl implements PasswordManagementService {

    static final SecureRandom SECURE_RANDOM = new SecureRandom();

    UserRepository userRepository;
    PasswordResetTokenRepository passwordResetTokenRepository;
    PasswordEncoder passwordEncoder;
    EmailService emailService;
    CurrentUserService currentUserService;

    @NonFinal
    @Value("${app.mail.password-reset-code-expiry-minutes:10}")
    long resetCodeExpiryMinutes;

    @NonFinal
    @Value("${app.mail.password-reset-max-attempts:5}")
    int maxResetCodeAttempts;

    @NonFinal
    @Value("${app.mail.password-reset-resend-cooldown-seconds:60}")
    long resetCodeResendCooldownSeconds;

    @NonFinal
    @Value("${app.mail.password-reset-max-requests:3}")
    int maxResetCodeRequests;

    @NonFinal
    @Value("${app.mail.password-reset-request-window-minutes:15}")
    long resetCodeRequestWindowMinutes;

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        validatePasswordConfirmation(request.getNewPassword(), request.getConfirmPassword());

        User user = currentUserService.getCurrentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_SAME_AS_CURRENT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        incrementTokenVersion(user);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        User user =
                userRepository.findByEmailAndDeletedFalse(request.getEmail()).orElse(null);
        if (user == null || isResendCooldownActive(user) || hasReachedResetRequestLimit(user)) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        passwordResetTokenRepository.invalidateUnusedTokensByUserId(user.getId(), now);

        String rawCode = generateResetCode();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .codeHash(passwordEncoder.encode(rawCode))
                .expiresAt(now.plusMinutes(resetCodeExpiryMinutes))
                .attemptCount(0)
                .build();

        passwordResetTokenRepository.save(resetToken);
        try {
            emailService.sendPasswordResetCode(user.getEmail(), rawCode);
        } catch (AppException exception) {
            log.error("Password reset email delivery failed for user {}", user.getId(), exception);
        }
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public void resetPassword(ResetPasswordRequest request) {
        validatePasswordConfirmation(request.getNewPassword(), request.getConfirmPassword());

        User user = userRepository
                .findByEmailAndDeletedFalse(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.PASSWORD_RESET_CODE_INVALID));
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PASSWORD_RESET_CODE_INVALID));

        LocalDateTime now = LocalDateTime.now();
        if (!resetToken.getExpiresAt().isAfter(now)) {
            resetToken.setUsedAt(now);
            passwordResetTokenRepository.save(resetToken);
            throw new AppException(ErrorCode.PASSWORD_RESET_CODE_EXPIRED);
        }
        if (resetToken.getAttemptCount() >= maxResetCodeAttempts) {
            throw new AppException(ErrorCode.PASSWORD_RESET_CODE_ATTEMPTS_EXCEEDED);
        }
        if (!passwordEncoder.matches(request.getCode(), resetToken.getCodeHash())) {
            int attemptCount = resetToken.getAttemptCount() + 1;
            resetToken.setAttemptCount(attemptCount);
            passwordResetTokenRepository.save(resetToken);
            if (attemptCount >= maxResetCodeAttempts) {
                resetToken.setUsedAt(now);
                passwordResetTokenRepository.save(resetToken);
                throw new AppException(ErrorCode.PASSWORD_RESET_CODE_ATTEMPTS_EXCEEDED);
            }
            throw new AppException(ErrorCode.PASSWORD_RESET_CODE_INVALID);
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_SAME_AS_CURRENT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        incrementTokenVersion(user);
        resetToken.setUsedAt(now);
        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);
        passwordResetTokenRepository.invalidateUnusedTokensByUserId(user.getId(), now);
    }

    private boolean isResendCooldownActive(User user) {
        return passwordResetTokenRepository
                .findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .filter(token -> token.getUsedAt() == null)
                .filter(token -> token.getCreatedAt() != null)
                .filter(token -> token.getCreatedAt()
                        .plusSeconds(resetCodeResendCooldownSeconds)
                        .isAfter(LocalDateTime.now()))
                .isPresent();
    }

    private boolean hasReachedResetRequestLimit(User user) {
        LocalDateTime windowStart = LocalDateTime.now().minusMinutes(resetCodeRequestWindowMinutes);
        return passwordResetTokenRepository.countByUserIdAndCreatedAtAfter(user.getId(), windowStart)
                >= maxResetCodeRequests;
    }

    private String generateResetCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private void validatePasswordConfirmation(String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new AppException(ErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }
    }

    private void incrementTokenVersion(User user) {
        user.setTokenVersion(user.getTokenVersion() + 1);
    }
}
