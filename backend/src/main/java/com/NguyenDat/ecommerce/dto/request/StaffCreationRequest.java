package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffCreationRequest {
    @Email
    @NotBlank
    private String email;

    @Size(min = 6)
    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    private String phoneNumber;


    private String avatar;


    private Set<String> roles;
}
