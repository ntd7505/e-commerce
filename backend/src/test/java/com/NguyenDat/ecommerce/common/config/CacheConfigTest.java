package com.NguyenDat.ecommerce.common.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.dto.response.category.CategoryResponse;

class CacheConfigTest {

    @Test
    void redisCacheConfiguration_shouldUseJsonSerializerAndCommonDefaults() {
        CacheConfig cacheConfig = new CacheConfig();
        var configuration = cacheConfig.redisCacheConfiguration("ecommerce:test:v2:cache:");
        ProductResponse product = ProductResponse.builder()
                .id(1L)
                .slug("airpods-pro-2")
                .variants(List.of(ProductVariantResponse.builder().id(10L).build()))
                .build();

        var serializationPair = configuration.getValueSerializationPair();
        Object result = serializationPair.read(serializationPair.write(product));

        assertEquals(Duration.ofMinutes(15), configuration.getTtlFunction().getTimeToLive("airpods-pro-2", product));
        assertFalse(configuration.getAllowCacheNullValues());
        assertEquals("ecommerce:test:v2:cache:product-details::", configuration.getKeyPrefixFor("product-details"));
        ProductResponse cachedProduct = assertInstanceOf(ProductResponse.class, result);
        assertEquals("airpods-pro-2", cachedProduct.getSlug());
        assertInstanceOf(
                ProductVariantResponse.class, cachedProduct.getVariants().getFirst());
    }

    @Test
    void redisCacheConfiguration_shouldDeserializeArrayListWithItsElementType() {
        CacheConfig cacheConfig = new CacheConfig();
        var configuration = cacheConfig.redisCacheConfiguration("ecommerce:test:v2:cache:");
        var categories = new ArrayList<CategoryResponse>();
        categories.add(CategoryResponse.builder()
                .id(1L)
                .name("Điện thoại")
                .slug("dien-thoai")
                .children(new ArrayList<>())
                .build());

        var serializationPair = configuration.getValueSerializationPair();
        Object result = serializationPair.read(serializationPair.write(categories));

        ArrayList<?> cachedCategories = assertInstanceOf(ArrayList.class, result);
        CategoryResponse cachedCategory = assertInstanceOf(CategoryResponse.class, cachedCategories.getFirst());
        assertEquals("dien-thoai", cachedCategory.getSlug());
    }
}
