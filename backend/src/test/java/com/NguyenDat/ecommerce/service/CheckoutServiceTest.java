package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.internal.CheckoutCalculation;
import com.NguyenDat.ecommerce.dto.internal.CouponCalculation;
import com.NguyenDat.ecommerce.dto.request.CheckoutPreviewRequest;
import com.NguyenDat.ecommerce.dto.request.CheckoutRequest;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.repository.AddressRepository;
import com.NguyenDat.ecommerce.repository.CartItemRepository;
import com.NguyenDat.ecommerce.repository.CartRepository;
import com.NguyenDat.ecommerce.service.impl.CheckoutServiceImpl;

@ExtendWith(MockitoExtension.class)
class CheckoutServiceTest {

    @Mock
    CartRepository cartRepository;

    @Mock
    CartItemRepository cartItemRepository;

    @Mock
    AddressRepository addressRepository;

    @Mock
    CouponApplicationService couponApplicationService;

    @InjectMocks
    CheckoutServiceImpl checkoutService;

    User user;
    Cart cart;
    CartItem cartItem;
    Address address;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).build();
        cart = new Cart();
        cart.setId(2L);

        Product product = new Product();
        product.setActive(true);

        ProductVariant variant = new ProductVariant();
        variant.setId(3L);
        variant.setProduct(product);
        variant.setActive(true);
        variant.setStockQuantity(5);
        variant.setPrice(100_000);

        cartItem = new CartItem();
        cartItem.setId(4L);
        cartItem.setProductVariant(variant);
        cartItem.setQuantity(2);

        address = new Address();
        address.setId(5L);
    }

    @Test
    void calculateForPreview_shouldCalculateAmountsWithoutCoupon() {
        CheckoutPreviewRequest request =
                CheckoutPreviewRequest.builder().cartItemIds(List.of(4L)).addressId(5L).build();
        mockCheckoutData();
        mockAddress();

        CheckoutCalculation result = checkoutService.calculateForPreview(user, request);

        assertEquals(BigDecimal.valueOf(200_000.0), result.getSubtotalAmount());
        assertEquals(BigDecimal.valueOf(30_000), result.getShippingFee());
        assertEquals(BigDecimal.valueOf(230_000.0), result.getTotalAmount());
        assertEquals(2, result.getTotalItems());
        verifyNoInteractions(couponApplicationService);
    }

    @Test
    void calculateForOrder_shouldApplyCouponUsingOrderCalculation() {
        CheckoutRequest request = CheckoutRequest.builder()
                .cartItemIds(List.of(4L))
                .addressId(5L)
                .couponCode("SALE10")
                .paymentMethod(PaymentMethod.COD)
                .build();
        mockCheckoutData();
        mockAddress();
        Coupon coupon = new Coupon();
        when(couponApplicationService.calculateForOrder("SALE10", user, BigDecimal.valueOf(200_000.0)))
                .thenReturn(new CouponCalculation(coupon, BigDecimal.valueOf(20_000)));

        CheckoutCalculation result = checkoutService.calculateForOrder(user, request);

        assertEquals(BigDecimal.valueOf(210_000.0), result.getTotalAmount());
        assertEquals(coupon, result.getCoupon());
        verify(couponApplicationService).calculateForOrder("SALE10", user, BigDecimal.valueOf(200_000.0));
    }

    @Test
    void calculateForPreview_shouldRejectInactiveVariant() {
        cartItem.getProductVariant().setActive(false);
        CheckoutPreviewRequest request = CheckoutPreviewRequest.builder().cartItemIds(List.of(4L)).addressId(5L).build();
        mockCheckoutData();

        AppException exception =
                assertThrows(AppException.class, () -> checkoutService.calculateForPreview(user, request));

        assertEquals(ErrorCode.CHECKOUT_CART_ITEM_INVALID, exception.getErrorCode());
    }

    @Test
    void calculateForPreview_shouldRejectOutOfStockItem() {
        cartItem.setQuantity(6);
        CheckoutPreviewRequest request = CheckoutPreviewRequest.builder().cartItemIds(List.of(4L)).addressId(5L).build();
        mockCheckoutData();

        AppException exception =
                assertThrows(AppException.class, () -> checkoutService.calculateForPreview(user, request));

        assertEquals(ErrorCode.CHECKOUT_CART_ITEM_OUT_OF_STOCK, exception.getErrorCode());
    }

    private void mockCheckoutData() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByIdAndCartId(4L, 2L)).thenReturn(Optional.of(cartItem));
    }

    private void mockAddress() {
        when(addressRepository.findByIdAndUserIdAndDeletedFalse(5L, 1L)).thenReturn(Optional.of(address));
    }
}
