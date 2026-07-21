package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.nguyendat.ecommerce.dto.response.PaymentMethodResponse;
import com.nguyendat.ecommerce.enums.PaymentMethod;
import com.nguyendat.ecommerce.service.impl.PaymentMethodServiceImpl;

class PaymentMethodServiceTest {

    PaymentMethodServiceImpl paymentMethodService = new PaymentMethodServiceImpl();

    @Test
    void getPaymentMethods_shouldExposeAllMethodsAndOnlyEnableCod() {
        List<PaymentMethodResponse> result = paymentMethodService.getPaymentMethods();

        assertEquals(PaymentMethod.values().length, result.size());
        assertTrue(result.stream()
                .filter(PaymentMethodResponse::isEnabled)
                .allMatch(method -> method.getMethod() == PaymentMethod.COD));
        assertEquals(1, result.stream().filter(PaymentMethodResponse::isEnabled).count());
    }
}

