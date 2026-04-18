package com.NguyenDat.ecommerce.modules.product.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductCreateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductVariantUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductVariantResponse;
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
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductCreateRequest productCreateRequest) {
        return ApiResponse.of(ResponseCode.PRODUCT_CREATED, productService.createProduct(productCreateRequest));
    }

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.of(ResponseCode.PRODUCTS_FETCHED, productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_FETCHED, productService.getProductById(id));
    }

    @GetMapping("/products/variants/{id}")
    public ApiResponse<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_VARIANT_FETCHED, productService.getVariantById(id));
    }

    @PutMapping("/products/{id}")
    public ApiResponse<ProductResponse> updateProductById(
            @RequestBody @Valid ProductUpdateRequest productUpdateRequest, @PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_UPDATED, productService.updateProductById(productUpdateRequest, id));
    }

    @PutMapping("/products/variants/{id}")
    public ApiResponse<ProductVariantResponse> updateVariantById(
            @RequestBody @Valid ProductVariantUpdateRequest productVariantUpdateRequest, @PathVariable Long id) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_UPDATED, productService.updateVariantById(productVariantUpdateRequest, id));
    }

    @DeleteMapping("/products/variants/{id}")
    public ApiResponse<Void> deleteProductVariantsById(@PathVariable Long id) {
        productService.deleteProductVariantsById(id);
        return ApiResponse.of(ResponseCode.PRODUCT_VARIANT_DELETED, null);
    }
}
