package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.entity.User;

public interface CheckoutService {

    CheckoutCalculation calculateForPreview(User user, CheckoutPreviewRequest request);

    CheckoutCalculation calculateForOrder(User user, CheckoutRequest request);
}
