package com.nguyendat.ecommerce.dto.request.auth;

import jakarta.validation.constraints.NotBlank;

import com.nguyendat.ecommerce.validator.PasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    String currentPassword;

    @NotBlank(message = "FIELD_REQUIRED")
    @PasswordConstraint(min = 8, message = "INVALID_PASSWORD_FORMAT")
    String newPassword;

    @NotBlank(message = "FIELD_REQUIRED")
    String confirmPassword;
}

