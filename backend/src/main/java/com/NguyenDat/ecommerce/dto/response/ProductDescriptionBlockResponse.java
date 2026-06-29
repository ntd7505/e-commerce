package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.NguyenDat.ecommerce.enums.ProductDescriptionBlockType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDescriptionBlockResponse {
    Long id;
    ProductDescriptionBlockType type;
    String title;
    String content;
    String imageUrl;
    String altText;
    int sortOrder;
    boolean active;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
