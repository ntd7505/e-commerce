package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentUpdateRequest {
    @NotNull(message = "PAYMENT_STATUS_REQUIRED")
    PaymentStatus status;
}
