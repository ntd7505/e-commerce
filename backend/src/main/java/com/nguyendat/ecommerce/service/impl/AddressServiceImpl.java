package com.nguyendat.ecommerce.service.impl;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.AddressRequest;
import com.nguyendat.ecommerce.dto.response.AddressResponse;
import com.nguyendat.ecommerce.entity.Address;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.mapper.AddressMapper;
import com.nguyendat.ecommerce.repository.AddressRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.AddressService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class AddressServiceImpl implements AddressService {

    AddressRepository addressRepository;
    AddressMapper addressMapper;
    UserRepository userRepository;

    @Transactional
    public AddressResponse createAddress(AddressRequest addressRequest) {
        User user = getCurrentUser();
        boolean firstAddress = !addressRepository.existsByUserIdAndDeletedFalse(user.getId());
        boolean isDefault = firstAddress || Boolean.TRUE.equals(addressRequest.getIsDefault());
        if (isDefault) {
            addressRepository.clearDefaultAddressByUserId(user.getId());
        }
        Address address = addressMapper.toAddress(addressRequest);
        address.setUser(user);
        address.setIsDefault(isDefault);
        return addressMapper.toAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest addressRequest) {
        User user = getCurrentUser();
        Address address = addressRepository
                .findByIdAndUserIdAndDeletedFalse(id, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        addressMapper.updateAddress(address, addressRequest);
        if (Boolean.TRUE.equals(addressRequest.getIsDefault()) && !address.getIsDefault()) {
            addressRepository.clearDefaultAddressByUserId(user.getId());
            address.setIsDefault(true);
        }
        return addressMapper.toAddressResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long id) {
        User user = getCurrentUser();
        Address address = addressRepository
                .findByIdAndUserIdAndDeletedFalse(id, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            throw new AppException(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED);
        }
        address.setDeleted(true);
        address.setIsDefault(false);
        addressRepository.save(address);
    }

    public List<AddressResponse> getMyAddresses() {
        User user = getCurrentUser();
        return addressRepository.findAllByUserIdAndDeletedFalse(user.getId()).stream()
                .map(addressMapper::toAddressResponse)
                .toList();
    }

    private User getCurrentUser() {
        String email = getCurrentUserEmail();

        return userRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return authentication.getName();
    }
}

