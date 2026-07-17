package com.NguyenDat.ecommerce.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import com.NguyenDat.ecommerce.validator.PasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    String email;

    @NotBlank(message = "FIELD_REQUIRED")
    @Pattern(regexp = "^\\d{6}$", message = "PASSWORD_RESET_CODE_INVALID")
    String code;

    @NotBlank(message = "FIELD_REQUIRED")
    @PasswordConstraint(min = 8, message = "INVALID_PASSWORD_FORMAT")
    String newPassword;

    @NotBlank(message = "FIELD_REQUIRED")
    String confirmPassword;
}
