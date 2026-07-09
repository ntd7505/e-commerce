package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.enums.PaymentStatus;

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
