package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.NguyenDat.ecommerce.enums.OrderStatus;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.enums.ShippingStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    Long id;

    OrderStatus status;
    PaymentStatus paymentStatus;
    ShippingStatus shippingStatus;

    String recipientName;
    String phoneNumber;
    String shippingAddress;

    Long addressId;
    Long couponId;
    String couponCode;

    List<OrderItemResponse> items;

    BigDecimal subtotalAmount;
    BigDecimal shippingFee;
    BigDecimal discountAmount;
    BigDecimal totalAmount;

    String note;

    PaymentResponse payment;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
