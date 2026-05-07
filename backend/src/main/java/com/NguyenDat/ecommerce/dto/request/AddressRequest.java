package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.NguyenDat.ecommerce.enums.AddressType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRequest {
    @NotBlank(message = "RECIPIENT_NAME_REQUIRED")
    @Size(max = 100, message = "RECIPIENT_NAME_INVALID")
    String recipientName;

    @NotBlank(message = "PHONE_NUMBER_REQUIRED")
    @Size(max = 20, message = "PHONE_NUMBER_INVALID")
    String phoneNumber;

    @NotBlank(message = "PROVINCE_NAME_REQUIRED")
    @Size(max = 100, message = "PROVINCE_NAME_INVALID")
    String provinceName;

    @NotBlank(message = "DISTRICT_NAME_REQUIRED")
    @Size(max = 100, message = "DISTRICT_NAME_INVALID")
    String districtName;

    @NotBlank(message = "WARD_NAME_REQUIRED")
    @Size(max = 100, message = "WARD_NAME_INVALID")
    String wardName;

    @NotBlank(message = "FULL_ADDRESS_REQUIRED")
    @Size(max = 200, message = "FULL_ADDRESS_INVALID")
    String fullAddress;

    @NotNull(message = "ADDRESS_TYPE_REQUIRED")
    AddressType addressType;

    Boolean isDefault;
}
