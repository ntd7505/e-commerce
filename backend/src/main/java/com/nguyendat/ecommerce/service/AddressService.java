package com.nguyendat.ecommerce.service;

import java.util.List;

import com.nguyendat.ecommerce.dto.request.AddressRequest;
import com.nguyendat.ecommerce.dto.response.AddressResponse;

public interface AddressService {

    AddressResponse createAddress(AddressRequest addressRequest);

    AddressResponse updateAddress(Long id, AddressRequest addressRequest);

    void deleteAddress(Long id);

    List<AddressResponse> getMyAddresses();
}

