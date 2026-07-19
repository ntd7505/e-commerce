package com.NguyenDat.ecommerce.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

import com.NguyenDat.ecommerce.enums.BannerPosition;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeBannerRequest {
    @NotNull(message = "Sản phẩm không được để trống")
    Long productId;

    @NotNull(message = "Vị trí không được để trống")
    BannerPosition position;

    String title;
    String subtitle;
    String imageUrl;
    String mobileImageUrl;
    String backgroundColor;
    
    boolean active;
    LocalDateTime startsAt;
    LocalDateTime endsAt;
}
