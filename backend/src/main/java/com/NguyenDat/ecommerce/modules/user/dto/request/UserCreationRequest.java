package com.NguyenDat.ecommerce.modules.user.dto.request;

import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.NguyenDat.ecommerce.modules.user.validator.PasswordConstraint;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreationRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Email(message = "INVALID_EMAIL")
    private String email;

    @NotBlank(message = "FIELD_REQUIRED")
    @PasswordConstraint
    private String password;

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(min = 5, message = "INVALID_FULL_NAME")
    private String fullName;

    @NotBlank(message = "FIELD_REQUIRED")
    @Pattern(regexp = "^[0-9]{10}$", message = "INVALID_PHONE")
    private String phoneNumber;

    private String avatarUrl;

    private Set<String> roles;
}
