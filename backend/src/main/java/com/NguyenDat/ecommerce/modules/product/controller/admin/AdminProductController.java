package com.NguyenDat.ecommerce.modules.product.controller.admin;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
public class AdminProductController {

    ProductService productService;

    @PostMapping("/products")
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductRequest productRequest) {
        return ApiResponse.of(ResponseCode.PRODUCT_CREATED, productService.createProduct(productRequest));
    }
}
