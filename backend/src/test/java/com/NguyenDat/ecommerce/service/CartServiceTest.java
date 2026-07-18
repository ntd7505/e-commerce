package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
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

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.CartItemRequest;
import com.NguyenDat.ecommerce.dto.request.GuestCartItemRequest;
import com.NguyenDat.ecommerce.dto.request.GuestCartRequest;
import com.NguyenDat.ecommerce.dto.response.CartResponse;
import com.NguyenDat.ecommerce.entity.Cart;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.Product;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.CartStatus;
import com.NguyenDat.ecommerce.mapper.CartMapper;
import com.NguyenDat.ecommerce.repository.CartItemRepository;
import com.NguyenDat.ecommerce.repository.CartRepository;
import com.NguyenDat.ecommerce.repository.ProductVariantRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;
import com.NguyenDat.ecommerce.service.impl.CartServiceImpl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class CartServiceTest {

    @Mock
    CartRepository cartRepository;

    @Mock
    CartItemRepository cartItemRepository;

    @Mock
    CartMapper cartMapper;

    @Mock
    UserRepository userRepository;

    @Mock
    ProductVariantRepository productVariantRepository;

    @InjectMocks
    CartServiceImpl cartService;

    User user;
    Cart cart;
    ProductVariant productVariant;
    CartItemRequest cartItemRequest;
    CartResponse cartResponse;

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

        cart = new Cart();
        cart.setId(1L);
        cart.setUser(user);
        cart.setStatus(CartStatus.ACTIVE);
        cart.setItems(new ArrayList<>());

        Product product = new Product();
        product.setId(10L);
        product.setName("Ao thun");
        product.setActive(true);
        product.setDeleted(false);

        productVariant = new ProductVariant();
        productVariant.setId(1L);
        productVariant.setProduct(product);
        productVariant.setVariantName("Size M");
        productVariant.setSku("AO-M-001");
        productVariant.setStockQuantity(10);
        productVariant.setPrice(150000);
        productVariant.setSalePrice(120000);
        productVariant.setActive(true);
        productVariant.setDeleted(false);

        cartItemRequest =
                CartItemRequest.builder().productVariantId(1L).quantity(2).build();

        cartResponse = CartResponse.builder()
                .id(1L)
                .status(CartStatus.ACTIVE)
                .totalItems(2)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCart_shouldCreateCart_whenUserHasNoCart() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> {
            Cart savedCart = invocation.getArgument(0);
            savedCart.setId(1L);
            return savedCart;
        });
        when(cartMapper.toCartResponse(any(Cart.class))).thenReturn(cartResponse);

        CartResponse result = cartService.getCart();

        assertEquals(1L, result.getId());
        verify(cartRepository).save(any(Cart.class));
        verify(cartMapper).toCartResponse(any(Cart.class));
    }

    @Test
    void addItemToCart_shouldCreateNewCartItem_whenVariantIsNotInCart() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartItemRepository.findByCartIdAndProductVariantId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartMapper.toCartResponse(cart)).thenReturn(cartResponse);

        CartResponse result = cartService.addItemToCart(cartItemRequest);

        assertEquals(1L, result.getId());
        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getItems().getFirst().getQuantity());
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void addItemToCart_shouldIncreaseQuantity_whenVariantAlreadyExistsInCart() {
        CartItem existingItem = new CartItem();
        existingItem.setId(1L);
        existingItem.setCart(cart);
        existingItem.setProductVariant(productVariant);
        existingItem.setQuantity(3);
        cart.getItems().add(existingItem);

        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartItemRepository.findByCartIdAndProductVariantId(1L, 1L)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(existingItem)).thenReturn(existingItem);
        when(cartMapper.toCartResponse(cart)).thenReturn(cartResponse);

        cartService.addItemToCart(cartItemRequest);

        assertEquals(5, existingItem.getQuantity());
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    void addItemToCart_shouldThrowException_whenQuantityExceedsStock() {
        CartItem existingItem = new CartItem();
        existingItem.setId(1L);
        existingItem.setCart(cart);
        existingItem.setProductVariant(productVariant);
        existingItem.setQuantity(9);
        cart.getItems().add(existingItem);

        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartItemRepository.findByCartIdAndProductVariantId(1L, 1L)).thenReturn(Optional.of(existingItem));

        AppException exception = assertThrows(AppException.class, () -> cartService.addItemToCart(cartItemRequest));

        assertEquals(ErrorCode.CART_ITEM_QUANTITY_EXCEEDS_STOCK, exception.getErrorCode());
        verify(cartItemRepository, never()).save(any());
    }

    @Test
    void deleteCartItem_shouldRemoveItem_whenItemBelongsToCurrentUserCart() {
        CartItem cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setCart(cart);
        cart.getItems().add(cartItem);

        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByIdAndCartId(1L, 1L)).thenReturn(Optional.of(cartItem));

        cartService.deleteCartItem(1L);

        verify(cartItemRepository).findByIdAndCartId(1L, 1L);
        verify(cartItemRepository).delete(cartItem);
    }

    @Test
    void deleteCartItem_shouldThrowException_whenItemDoesNotBelongToCurrentUserCart() {
        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByIdAndCartId(1L, 1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> cartService.deleteCartItem(1L));

        assertEquals(ErrorCode.CART_ITEM_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void previewGuestCart_shouldClampQuantity_whenQuantityExceedsStock() {
        GuestCartItemRequest itemReq = new GuestCartItemRequest(1L, 20); // stock is 10
        GuestCartRequest request = new GuestCartRequest(java.util.List.of(itemReq));

        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartMapper.toCartResponse(any(Cart.class))).thenAnswer(invocation -> {
            Cart savedCart = invocation.getArgument(0);
            assertEquals(1, savedCart.getItems().size());
            assertEquals(10, savedCart.getItems().getFirst().getQuantity());
            return cartResponse;
        });

        cartService.previewGuestCart(request);
        verify(productVariantRepository).findSellableVariantById(1L);
    }

    @Test
    void previewGuestCart_shouldThrowException_whenVariantInactive() {
        GuestCartItemRequest itemReq = new GuestCartItemRequest(1L, 2);
        GuestCartRequest request = new GuestCartRequest(java.util.List.of(itemReq));

        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> cartService.previewGuestCart(request));
        assertEquals(ErrorCode.PRODUCT_VARIANT_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void mergeGuestCart_shouldMergeAndClamp_whenQuantityExceedsStock() {
        CartItem existingItem = new CartItem();
        existingItem.setId(1L);
        existingItem.setCart(cart);
        existingItem.setProductVariant(productVariant);
        existingItem.setQuantity(6);
        cart.getItems().add(existingItem);

        GuestCartItemRequest itemReq = new GuestCartItemRequest(1L, 8); // 6 + 8 = 14 > 10 stock
        GuestCartRequest request = new GuestCartRequest(java.util.List.of(itemReq));

        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartItemRepository.findByCartIdAndProductVariantId(1L, 1L)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(existingItem)).thenReturn(existingItem);
        when(cartMapper.toCartResponse(cart)).thenReturn(cartResponse);

        cartService.mergeGuestCart(request);

        assertEquals(10, existingItem.getQuantity());
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    void mergeGuestCart_shouldAddNewItem_whenItemNotInCart() {
        GuestCartItemRequest itemReq = new GuestCartItemRequest(1L, 5);
        GuestCartRequest request = new GuestCartRequest(java.util.List.of(itemReq));

        when(userRepository.findByEmailAndDeletedFalse("dat@gmail.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productVariantRepository.findSellableVariantById(1L)).thenReturn(Optional.of(productVariant));
        when(cartItemRepository.findByCartIdAndProductVariantId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartMapper.toCartResponse(cart)).thenReturn(cartResponse);

        cartService.mergeGuestCart(request);

        assertEquals(1, cart.getItems().size());
        assertEquals(5, cart.getItems().getFirst().getQuantity());
        verify(cartItemRepository).save(any(CartItem.class));
    }
}
