package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.AddressRequest;
import com.NguyenDat.ecommerce.dto.response.AddressResponse;

public interface AddressService {

    AddressResponse createAddress(AddressRequest addressRequest);

    AddressResponse updateAddress(Long id, AddressRequest addressRequest);

    void deleteAddress(Long id);

    List<AddressResponse> getMyAddresses();
}
