package com.NguyenDat.ecommerce.dto.response;

import lombok.*;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffCreationResponse {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatar;
    private Set<String> roles;
}
