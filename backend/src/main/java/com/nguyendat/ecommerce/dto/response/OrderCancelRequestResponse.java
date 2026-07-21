package com.nguyendat.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.nguyendat.ecommerce.enums.CancelRequestStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCancelRequestResponse {
    Long id;
    Long orderId;
    String reason;
    CancelRequestStatus status;
    Long requestedBy;
    Long reviewedBy;
    String reviewNote;
    LocalDateTime requestedAt;
    LocalDateTime reviewedAt;
}

