package com.NguyenDat.ecommerce.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.NguyenDat.ecommerce.enums.PaymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {

    @NotEmpty(message = "CART_ITEMS_REQUIRED")
    List<Long> cartItemIds;

    Long addressId;

    String couponCode;

    @NotNull(message = "PAYMENT_METHOD_REQUIRED")
    PaymentMethod paymentMethod;

    @Size(max = 500, message = "ORDER_NOTE_INVALID")
    String note;
}
