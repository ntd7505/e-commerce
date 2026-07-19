package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.NguyenDat.ecommerce.enums.BannerPosition;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeBannerResponse {
    Long id;
    BannerPosition position;
    String title;
    String subtitle;
    String imageUrl;
    String mobileImageUrl;
    String backgroundColor;
    int sortOrder;
    boolean active;
    LocalDateTime startsAt;
    LocalDateTime endsAt;
    ProductSummaryResponse product;
}
