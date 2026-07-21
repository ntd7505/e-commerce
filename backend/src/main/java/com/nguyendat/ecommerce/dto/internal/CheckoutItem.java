package com.nguyendat.ecommerce.dto.internal;

import java.math.BigDecimal;

import com.nguyendat.ecommerce.entity.ProductVariant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItem {
    private ProductVariant variant;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Long cartItemId;
}

