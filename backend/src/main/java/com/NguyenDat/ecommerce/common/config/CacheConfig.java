package com.NguyenDat.ecommerce.common.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.cache.autoconfigure.RedisCacheManagerBuilderCustomizer;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

import com.NguyenDat.ecommerce.common.constant.CacheName;

import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;

@Configuration(proxyBeanMethods = false)
@EnableCaching
public class CacheConfig implements CachingConfigurer {

    @Bean
    RedisSerializer<Object> cacheValueSerializer() {
        var typeValidator = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.NguyenDat.ecommerce.dto.response")
                .allowIfSubType("java.util")
                .allowIfSubType("java.time")
                .build();

        return GenericJacksonJsonRedisSerializer.builder()
                .enableDefaultTyping(typeValidator)
                .build();
    }

    @Bean
    RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer(
            RedisSerializer<Object> cacheValueSerializer, @Value("${app.cache.key-prefix}") String keyPrefix) {
        return builder -> builder.withCacheConfiguration(
                        CacheName.PRODUCT_DETAILS,
                        cacheConfiguration(Duration.ofMinutes(10), keyPrefix, cacheValueSerializer))
                .withCacheConfiguration(
                        CacheName.BRANDS, cacheConfiguration(Duration.ofMinutes(30), keyPrefix, cacheValueSerializer))
                .withCacheConfiguration(
                        CacheName.CATEGORIES,
                        cacheConfiguration(Duration.ofMinutes(30), keyPrefix, cacheValueSerializer));
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new ResilientCacheErrorHandler();
    }

    private RedisCacheConfiguration cacheConfiguration(
            Duration ttl, String keyPrefix, RedisSerializer<Object> valueSerializer) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(ttl)
                .disableCachingNullValues()
                .prefixCacheNameWith(keyPrefix)
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(valueSerializer));
    }
}
