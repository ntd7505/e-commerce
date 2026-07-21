package com.nguyendat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.enums.PaymentStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    Long id;

    PaymentMethod method;
    PaymentStatus status;

    BigDecimal amount;

    String transactionCode;
    LocalDateTime paidAt;

    Long orderId;
    String qrCodeUrl;
    String bankCode;
    String bankAccount;
    String bankAccountName;
    String transferContent;
}

