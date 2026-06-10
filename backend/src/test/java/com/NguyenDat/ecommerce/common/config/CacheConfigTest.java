package com.NguyenDat.ecommerce.common.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;

class CacheConfigTest {

    @Test
    void cacheValueSerializer_shouldDeserializeProductResponseWithItsOriginalType() {
        CacheConfig cacheConfig = new CacheConfig();
        var serializer = cacheConfig.cacheValueSerializer();
        ProductResponse product = ProductResponse.builder()
                .id(1L)
                .slug("airpods-pro-2")
                .variants(List.of(ProductVariantResponse.builder().id(10L).build()))
                .build();

        Object result = serializer.deserialize(serializer.serialize(product));

        ProductResponse cachedProduct = assertInstanceOf(ProductResponse.class, result);
        assertEquals("airpods-pro-2", cachedProduct.getSlug());
        assertInstanceOf(
                ProductVariantResponse.class, cachedProduct.getVariants().getFirst());
    }
}
