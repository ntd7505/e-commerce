package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.AddressRequest;
import com.nguyendat.ecommerce.dto.response.AddressResponse;
import com.nguyendat.ecommerce.entity.Address;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.AddressType;
import com.nguyendat.ecommerce.mapper.AddressMapper;
import com.nguyendat.ecommerce.repository.AddressRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.impl.AddressServiceImpl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class AddressServiceTest {

    @Mock
    AddressRepository addressRepository;

    @Mock
    AddressMapper addressMapper;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    AddressServiceImpl addressService;

    User user;
    AddressRequest addressRequest;
    Address address;
    AddressResponse addressResponse;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext()
                .setAuthentication(
                        new UsernamePasswordAuthenticationToken("dat@gmail.com", null, AuthorityUtils.NO_AUTHORITIES));

        user = User.builder()
                .id(1L)
                .email("dat@gmail.com")
                .password("Dat@1234")
                .fullName("Nguyen Dat")
                .phoneNumber("0901111222")
                .build();

        addressRequest = AddressRequest.builder()
                .recipientName("Nguyen Van A")
                .phoneNumber("0901111222")
                .provinceName("Thai Binh")
                .districtName("Vu Thu")
                .wardName("Tan Lap")
                .fullAddress("So 12, duong ABC")
                .addressType(AddressType.HOME)
                .isDefault(false)
                .build();

        address = new Address();
        address.setId(1L);
        address.setRecipientName("Nguyen Van A");
        address.setPhoneNumber("0901111222");
        address.setProvinceName("Thai Binh");
        address.setDistrictName("Vu Thu");
        address.setWardName("Tan Lap");
        address.setFullAddress("So 12, duong ABC");
        address.setAddressType(AddressType.HOME);
        address.setDeleted(false);
        address.setIsDefault(false);

        addressResponse = AddressResponse.builder()
                .id(1L)
                .recipientName("Nguyen Van A")
                .phoneNumber("0901111222")
                .provinceName("Thai Binh")
                .districtName("Vu Thu")
                .wardName("Tan Lap")
                .fullAddress("So 12, duong ABC")
                .addressType(AddressType.HOME)
                .isDefault(true)
                .deleted(false)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createAddress_shouldSetDefaultTrue_whenThisIsFirstAddress() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.existsByUserIdAndDeletedFalse(1L)).thenReturn(false);
        doNothing().when(addressRepository).clearDefaultAddressByUserId(1L);
        when(addressMapper.toAddress(addressRequest)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(addressMapper.toAddressResponse(address)).thenReturn(addressResponse);

        AddressResponse result = addressService.createAddress(addressRequest);

        assertEquals(1L, result.getId());
        assertTrue(address.getIsDefault());
        assertEquals(user, address.getUser());
        verify(addressRepository).clearDefaultAddressByUserId(1L);
        verify(addressRepository).save(address);
    }

    @Test
    void createAddress_shouldClearOldDefault_whenRequestDefaultIsTrue() {
        addressRequest.setIsDefault(true);
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.existsByUserIdAndDeletedFalse(1L)).thenReturn(true);
        doNothing().when(addressRepository).clearDefaultAddressByUserId(1L);
        when(addressMapper.toAddress(addressRequest)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(addressMapper.toAddressResponse(address)).thenReturn(addressResponse);

        addressService.createAddress(addressRequest);

        assertTrue(address.getIsDefault());
        verify(addressRepository).clearDefaultAddressByUserId(1L);
    }

    @Test
    void updateAddress_shouldSetDefaultTrue_whenRequestDefaultIsTrue() {
        addressRequest.setIsDefault(true);
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserIdAndDeletedFalse(1L, 1L)).thenReturn(Optional.of(address));
        doNothing().when(addressRepository).clearDefaultAddressByUserId(1L);
        when(addressRepository.save(address)).thenReturn(address);
        when(addressMapper.toAddressResponse(address)).thenReturn(addressResponse);

        AddressResponse result = addressService.updateAddress(1L, addressRequest);

        assertEquals(1L, result.getId());
        assertTrue(address.getIsDefault());
        verify(addressMapper).updateAddress(address, addressRequest);
        verify(addressRepository).clearDefaultAddressByUserId(1L);
        verify(addressRepository).save(address);
    }

    @Test
    void getMyAddresses_shouldReturnCurrentUserAddresses() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.findAllByUserIdAndDeletedFalse(1L)).thenReturn(List.of(address));
        when(addressMapper.toAddressResponse(address)).thenReturn(addressResponse);

        List<AddressResponse> result = addressService.getMyAddresses();

        assertEquals(1, result.size());
        assertEquals(1L, result.getFirst().getId());
        verify(addressRepository).findAllByUserIdAndDeletedFalse(1L);
    }

    @Test
    void deleteAddress_shouldSoftDeleteAddress_whenAddressIsNotDefault() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserIdAndDeletedFalse(1L, 1L)).thenReturn(Optional.of(address));
        when(addressRepository.save(address)).thenReturn(address);

        addressService.deleteAddress(1L);

        assertTrue(address.isDeleted());
        assertFalse(address.getIsDefault());
        verify(addressRepository).save(address);
    }

    @Test
    void deleteAddress_shouldThrowException_whenAddressIsDefault() {
        address.setIsDefault(true);
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(addressRepository.findByIdAndUserIdAndDeletedFalse(1L, 1L)).thenReturn(Optional.of(address));

        AppException exception = assertThrows(AppException.class, () -> addressService.deleteAddress(1L));

        assertEquals(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED, exception.getErrorCode());
        verify(addressRepository, never()).save(any());
    }

    @Test
    void createAddress_shouldThrowException_whenUserIsNotAuthenticated() {
        SecurityContextHolder.clearContext();

        AppException exception = assertThrows(AppException.class, () -> addressService.createAddress(addressRequest));

        assertEquals(ErrorCode.UNAUTHENTICATED, exception.getErrorCode());
        verify(addressRepository, never()).save(any());
    }
}

