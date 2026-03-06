package com.NguyenDat.ecommerce.dto.response;

import java.util.Set;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponse {
    private String email;
    private String fullName;
    private String phoneNumber;
    private String avatar;
    private Set<String> roles;
}
