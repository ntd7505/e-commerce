package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
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
public class BuyNowCheckoutRequest {
    @NotNull(message = "PRODUCT_VARIANT_REQUIRED")
    Long productVariantId;

    @NotNull(message = "QUANTITY_REQUIRED")
    @Min(value = 1, message = "QUANTITY_INVALID")
    Integer quantity;

    Long addressId;

    String couponCode;

    @NotNull(message = "PAYMENT_METHOD_REQUIRED")
    PaymentMethod paymentMethod;

    @Size(max = 500, message = "ORDER_NOTE_INVALID")
    String note;
}
