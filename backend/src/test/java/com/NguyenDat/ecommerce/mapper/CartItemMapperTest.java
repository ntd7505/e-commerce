package com.NguyenDat.ecommerce.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.NguyenDat.ecommerce.dto.response.CartItemResponse;
import com.NguyenDat.ecommerce.dto.response.CheckoutItemResponse;
import com.NguyenDat.ecommerce.dto.response.OrderItemResponse;
import com.NguyenDat.ecommerce.entity.CartItem;
import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.entity.Product;
import com.NguyenDat.ecommerce.entity.ProductMedia;
import com.NguyenDat.ecommerce.entity.ProductVariant;

class CartItemMapperTest {

    CartItemMapper mapper = Mappers.getMapper(CartItemMapper.class);
    CheckoutItemMapper checkoutItemMapper = Mappers.getMapper(CheckoutItemMapper.class);
    OrderMapper orderMapper = Mappers.getMapper(OrderMapper.class);

    @Test
    void toCartItemResponse_shouldPreferThumbnailMedia() {
        CartItem item = cartItemWithMedia(List.of(
                media("fallback.jpg", false, 0),
                media("thumbnail.jpg", true, 10)
        ));

        CartItemResponse result = mapper.toCartItemResponse(item);

        assertEquals("thumbnail.jpg", result.getThumbnailUrl());
        assertEquals("iphone-15-128gb", result.getProductSlug());
    }

    @Test
    void toCartItemResponse_shouldFallbackToFirstActiveMediaBySortOrder() {
        CartItem item = cartItemWithMedia(List.of(
                media("second.jpg", false, 2),
                media("first.jpg", false, 1)
        ));

        CartItemResponse result = mapper.toCartItemResponse(item);

        assertEquals("first.jpg", result.getThumbnailUrl());
    }

    @Test
    void toCartItemResponse_shouldReturnNullThumbnailWhenProductHasNoMedia() {
        CartItem item = cartItemWithMedia(List.of());

        CartItemResponse result = mapper.toCartItemResponse(item);

        assertNull(result.getThumbnailUrl());
    }

    @Test
    void toCheckoutItemResponse_shouldIncludeThumbnailUrl() {
        CartItem item = cartItemWithMedia(List.of(media("checkout-thumbnail.jpg", true, 0)));

        CheckoutItemResponse result = checkoutItemMapper.toCheckoutItemResponse(item);

        assertEquals("checkout-thumbnail.jpg", result.getThumbnailUrl());
    }

    @Test
    void toOrderItemResponse_shouldIncludeThumbnailUrl() {
        OrderItem item = orderItemWithMedia(List.of(media("order-thumbnail.jpg", true, 0)));

        OrderItemResponse result = orderMapper.toOrderItemResponse(item);

        assertEquals("order-thumbnail.jpg", result.getThumbnailUrl());
    }

    private CartItem cartItemWithMedia(List<ProductMedia> media) {
        Product product = new Product();
        product.setId(1L);
        product.setName("iPhone");
        product.setSlug("iphone-15-128gb");
        product.setMedia(media);

        ProductVariant variant = new ProductVariant();
        variant.setId(2L);
        variant.setProduct(product);
        variant.setVariantName("128GB");
        variant.setSku("SKU-1");

        CartItem item = new CartItem();
        item.setId(3L);
        item.setProductVariant(variant);
        item.setQuantity(2);
        item.setUnitPrice(BigDecimal.valueOf(100));
        return item;
    }

    private OrderItem orderItemWithMedia(List<ProductMedia> media) {
        Product product = new Product();
        product.setId(1L);
        product.setName("iPhone");
        product.setMedia(media);

        ProductVariant variant = new ProductVariant();
        variant.setId(2L);
        variant.setProduct(product);
        variant.setVariantName("128GB");
        variant.setSku("SKU-1");

        OrderItem item = new OrderItem();
        item.setId(4L);
        item.setProductVariant(variant);
        item.setProductName("iPhone");
        item.setVariantName("128GB");
        item.setSku("SKU-1");
        item.setQuantity(1);
        item.setUnitPrice(BigDecimal.valueOf(100));
        item.setLineTotal(BigDecimal.valueOf(100));
        return item;
    }

    private ProductMedia media(String url, boolean thumbnail, int sortOrder) {
        ProductMedia media = new ProductMedia();
        media.setUrl(url);
        media.setThumbnail(thumbnail);
        media.setSortOrder(sortOrder);
        media.setActive(true);
        media.setDeleted(false);
        return media;
    }
}
