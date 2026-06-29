package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductSpecificationResponse {
    Long id;
    String groupName;
    String specKey;
    String specValue;
    int sortOrder;
    boolean active;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
