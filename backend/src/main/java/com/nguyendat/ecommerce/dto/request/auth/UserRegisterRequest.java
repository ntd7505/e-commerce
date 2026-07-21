package com.nguyendat.ecommerce.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.nguyendat.ecommerce.validator.PasswordConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    private String email;

    @NotBlank(message = "FIELD_REQUIRED")
    @PasswordConstraint(min = 8, message = "INVALID_PASSWORD_FORMAT")
    private String password;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(min = 5, message = "INVALID_FULL_NAME")
    private String fullName;

    @NotBlank(message = "FIELD_REQUIRED")
    @Pattern(regexp = "^[0-9]{10}$", message = "INVALID_PHONE")
    private String phoneNumber;
}

