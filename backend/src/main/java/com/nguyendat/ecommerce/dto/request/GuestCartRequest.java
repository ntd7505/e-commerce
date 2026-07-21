package com.nguyendat.ecommerce.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestCartRequest {
    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    private List<GuestCartItemRequest> items;
}

