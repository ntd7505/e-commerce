package com.NguyenDat.ecommerce.dto.response;

import com.NguyenDat.ecommerce.enums.PaymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentMethodResponse {
    PaymentMethod method;
    String name;
    String description;
    boolean enabled;
}
