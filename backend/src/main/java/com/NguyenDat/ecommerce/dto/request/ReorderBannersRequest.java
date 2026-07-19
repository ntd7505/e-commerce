package com.NguyenDat.ecommerce.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReorderBannersRequest {
    @NotEmpty(message = "Danh sách ID không được để trống")
    List<Long> bannerIds;
}
