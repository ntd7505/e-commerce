package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String phoneNumber;

    private String avatar;

    //    private Set<String> roles;
}
