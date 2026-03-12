package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    @NotBlank(message = "FIELD_REQUIRED")
    @Size(min = 5, message = "INVALID_FULL_NAME")
    private String fullName;

    @NotBlank(message = "FIELD_REQUIRED")
    @Pattern(regexp = "^[0-9]{10}$", message = "INVALID_PHONE")
    private String phoneNumber;

    private String avatar;

    //    private Set<String> roles;
}
