package com.NguyenDat.ecommerce.modules.user.dto.request;

import jakarta.validation.constraints.NotNull;

import com.NguyenDat.ecommerce.modules.user.enums.Active;

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
