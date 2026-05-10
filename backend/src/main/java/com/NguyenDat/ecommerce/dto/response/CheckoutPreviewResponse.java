package com.NguyenDat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.NguyenDat.ecommerce.enums.PaymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutPreviewResponse {
    AddressResponse shippingAddress;

    List<CheckoutItemResponse> items;

    BigDecimal subtotalAmount;
    BigDecimal shippingFee;
    BigDecimal discountAmount;
    BigDecimal totalAmount;

    Integer totalItems;

    List<PaymentMethod> paymentMethods;

    String selectedCouponCode;
}
