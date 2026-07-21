package com.nguyendat.ecommerce.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.controller.client.PaymentMethodController;
import com.nguyendat.ecommerce.dto.response.PaymentMethodResponse;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.service.PaymentMethodService;

@WebMvcTest(PaymentMethodController.class)
@AutoConfigureMockMvc(addFilters = false)
class PaymentMethodControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    PaymentMethodService paymentMethodService;

    @Test
    void getPaymentMethods_shouldReturnAvailableMethods() throws Exception {
        PaymentMethodResponse response = PaymentMethodResponse.builder()
                .method(PaymentMethod.COD)
                .enabled(true)
                .build();
        when(paymentMethodService.getPaymentMethods()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/client/payment-methods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResponseCode.PAYMENT_METHODS_FETCHED.getCode()))
                .andExpect(jsonPath("$.data[0].method").value("COD"))
                .andExpect(jsonPath("$.data[0].enabled").value(true));

        verify(paymentMethodService).getPaymentMethods();
    }
}

