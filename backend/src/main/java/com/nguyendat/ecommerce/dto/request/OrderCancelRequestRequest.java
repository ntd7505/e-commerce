package com.nguyendat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCancelRequestRequest {
    @NotBlank(message = "ORDER_CANCEL_REASON_REQUIRED")
    @Size(max = 500, message = "ORDER_CANCEL_REASON_INVALID")
    String reason;
}

