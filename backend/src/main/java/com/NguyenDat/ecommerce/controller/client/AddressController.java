package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.dto.request.AddressRequest;
import com.NguyenDat.ecommerce.dto.response.AddressResponse;
import com.NguyenDat.ecommerce.service.AddressService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class AddressController {

    AddressService addressService;

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @RequestBody @Valid AddressRequest addressRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.ADDRESS_CREATED, addressService.createAddress(addressRequest)));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddresses(
            @RequestBody @Valid AddressRequest addressRequest, @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.ADDRESS_UPDATED, addressService.updateAddress(id, addressRequest)));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAllAddress() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.ADDRESSES_FETCHED, addressService.getMyAddresses()));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> deleteAddressById(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.ADDRESS_DELETED, null));
    }
}
