package com.NguyenDat.ecommerce.modules.product.service;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.modules.product.dto.request.ProductRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    public ProductResponse createProduct(@Valid ProductRequest productRequest) {

        return null;
    }
}
