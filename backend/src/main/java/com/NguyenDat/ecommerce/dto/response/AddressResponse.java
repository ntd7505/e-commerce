package com.NguyenDat.ecommerce.dto.response;

import java.time.LocalDateTime;

import com.NguyenDat.ecommerce.enums.AddressType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {
    Long id;

    String recipientName;
    String phoneNumber;

    String provinceName;
    String districtName;
    String wardName;
    String fullAddress;

    AddressType addressType;

    boolean isDefault;
    boolean deleted;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
