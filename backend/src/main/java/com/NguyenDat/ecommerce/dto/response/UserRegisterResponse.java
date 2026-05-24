package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterResponse {
    Long id;
    String email;
    String fullName;
    String phoneNumber;
    Boolean active;
    LocalDateTime createdAt;
}
