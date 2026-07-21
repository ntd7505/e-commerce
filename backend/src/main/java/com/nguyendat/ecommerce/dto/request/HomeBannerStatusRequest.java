package com.nguyendat.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeBannerStatusRequest {
    @NotNull(message = "Trạng thái active không được để trống")
    Boolean active;
}

