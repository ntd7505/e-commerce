package com.nguyendat.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.nguyendat.ecommerce.enums.CartStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    Long id;
    CartStatus status;
    List<CartItemResponse> items;
    Integer totalItems;
    BigDecimal subtotalAmount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

