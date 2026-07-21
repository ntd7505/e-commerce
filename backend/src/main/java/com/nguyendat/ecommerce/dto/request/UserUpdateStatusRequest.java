package com.nguyendat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

import com.nguyendat.ecommerce.enums.Active;

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

