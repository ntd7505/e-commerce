package com.nguyendat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandStatusUpdateRequest {

    @NotNull(message = "FIELD_REQUIRED")
    Boolean active;
}

