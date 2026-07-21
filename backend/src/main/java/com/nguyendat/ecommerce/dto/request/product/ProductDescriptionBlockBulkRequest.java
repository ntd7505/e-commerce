package com.nguyendat.ecommerce.dto.request.product;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDescriptionBlockBulkRequest {
    @Valid
    @NotNull(message = "FIELD_REQUIRED")
    @Size(max = 50)
    List<ProductDescriptionBlockRequest> blocks;
}

