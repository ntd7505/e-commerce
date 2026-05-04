package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

import com.NguyenDat.ecommerce.enums.Active;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateStatusRequest {
    @NotNull(message = "FIELD_REQUIRED")
    Active status;
}
