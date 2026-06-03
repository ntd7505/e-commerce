package com.NguyenDat.ecommerce.controller.client;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.service.ProductService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.CLIENT_PREFIX)
public class ClientProductController {

    ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> showProductsPage(@Valid PageRequest pageRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCTS_FETCHED, productService.showProductsInPage(pageRequest.toPageable())));
    }

    @GetMapping("/products/all")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> showAllProducts() {
        return ResponseEntity.ok(ApiResponse.ofList(ResponseCode.PRODUCTS_FETCHED, productService.showAllProducts()));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ApiResponse<ProductResponse>> showProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_FETCHED, productService.showProductBySlug(slug)));
    }
}
