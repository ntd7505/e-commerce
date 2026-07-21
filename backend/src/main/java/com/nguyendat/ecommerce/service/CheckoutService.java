package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.dto.internal.CheckoutCalculation;
import com.nguyendat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.nguyendat.ecommerce.dto.request.CheckoutRequest;
import com.nguyendat.ecommerce.entity.User;

public interface CheckoutService {

    CheckoutCalculation calculateForPreview(User user, CheckoutPreviewRequest request);

    CheckoutCalculation calculateForOrder(User user, CheckoutRequest request);

    CheckoutCalculation calculateBuyNowForPreview(
            User user, com.nguyendat.ecommerce.dto.request.BuyNowPreviewRequest request);

    CheckoutCalculation calculateBuyNowForOrder(
            User user, com.nguyendat.ecommerce.dto.request.BuyNowCheckoutRequest request);
}

