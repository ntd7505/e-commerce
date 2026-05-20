package com.NguyenDat.ecommerce.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.controller.client.AddressController;
import com.NguyenDat.ecommerce.dto.request.AddressRequest;
import com.NguyenDat.ecommerce.dto.response.AddressResponse;
import com.NguyenDat.ecommerce.enums.AddressType;
import com.NguyenDat.ecommerce.service.AddressService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import tools.jackson.databind.ObjectMapper;

@WebMvcTest(AddressController.class)
@AutoConfigureMockMvc(addFilters = false)
@FieldDefaults(level = AccessLevel.PRIVATE)
class AddressControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    AddressService addressService;

    AddressRequest addressRequest;
    AddressResponse addressResponse;

    @BeforeEach
    void setUp() {
        addressRequest = AddressRequest.builder()
                .recipientName("Nguyen Van A")
                .phoneNumber("0901111222")
                .provinceName("Thai Binh")
                .districtName("Vu Thu")
                .wardName("Tan Lap")
                .fullAddress("So 12, duong ABC")
                .addressType(AddressType.HOME)
                .isDefault(true)
                .build();

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

    @Test
    void createAddress_shouldReturnCreatedResponse_whenRequestIsValid() throws Exception {
        when(addressService.createAddress(any(AddressRequest.class))).thenReturn(addressResponse);

        mockMvc.perform(post("/api/v1/client/addresses")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(ResponseCode.ADDRESS_CREATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ADDRESS_CREATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.recipientName").value("Nguyen Van A"))
                .andExpect(jsonPath("$.data.default").value(true));

        verify(addressService).createAddress(any(AddressRequest.class));
    }

    @Test
    void getMyAddresses_shouldReturnFetchedResponse_whenDataExists() throws Exception {
        when(addressService.getMyAddresses()).thenReturn(List.of(addressResponse));

        mockMvc.perform(get("/api/v1/client/addresses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ADDRESSES_FETCHED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ADDRESSES_FETCHED.getMessage()))
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].default").value(true));

        verify(addressService).getMyAddresses();
    }

    @Test
    void updateAddress_shouldReturnUpdatedResponse_whenRequestIsValid() throws Exception {
        when(addressService.updateAddress(eq(1L), any(AddressRequest.class))).thenReturn(addressResponse);

        mockMvc.perform(patch("/api/v1/client/addresses/{id}", 1L)
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ADDRESS_UPDATED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ADDRESS_UPDATED.getMessage()))
                .andExpect(jsonPath("$.data.id").value(1));

        verify(addressService).updateAddress(eq(1L), any(AddressRequest.class));
    }

    @Test
    void deleteAddress_shouldReturnDeletedResponse_whenAddressExists() throws Exception {
        doNothing().when(addressService).deleteAddress(1L);

        mockMvc.perform(delete("/api/v1/client/addresses/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.ADDRESS_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ResponseCode.ADDRESS_DELETED.getMessage()));

        verify(addressService).deleteAddress(1L);
    }

    @Test
    void deleteAddress_shouldReturnErrorResponse_whenDefaultAddressIsDeleted() throws Exception {
        doThrow(new AppException(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED))
                .when(addressService)
                .deleteAddress(1L);

        mockMvc.perform(delete("/api/v1/client/addresses/{id}", 1L))
                .andExpect(status().is(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED
                        .getStatusCode()
                        .value()))
                .andExpect(jsonPath("$.code").value(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED.getCode()))
                .andExpect(jsonPath("$.message").value(ErrorCode.DEFAULT_ADDRESS_CANNOT_BE_DELETED.getMessage()));

        verify(addressService).deleteAddress(1L);
    }
}
