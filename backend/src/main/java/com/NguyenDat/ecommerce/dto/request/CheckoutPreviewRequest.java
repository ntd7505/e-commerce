package com.NguyenDat.ecommerce.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutPreviewRequest {
    @NotEmpty(message = "CART_ITEMS_REQUIRED")
    List<Long> cartItemIds;

    String couponCode;

    Long addressId;
}
