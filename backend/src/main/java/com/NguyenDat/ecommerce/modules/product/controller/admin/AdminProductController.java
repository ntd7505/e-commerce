package com.NguyenDat.ecommerce.modules.product.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.product.dto.request.*;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.modules.product.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@Tag(name = "Admin Products", description = "Product, variant and media management APIs")
public class AdminProductController {

    ProductService productService;

    @Operation(
            tags = "Admin Products",
            summary = "Create product",
            description = "Create a new product with initial variants and media.")
    @PostMapping("/products")
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductCreateRequest productCreateRequest) {
        return ApiResponse.of(ResponseCode.PRODUCT_CREATED, productService.createProduct(productCreateRequest));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Get all products",
            description = "Fetch all non-deleted products for admin management.")
    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.of(ResponseCode.PRODUCTS_FETCHED, productService.getAllProducts());
    }

    @Operation(
            tags = "Admin Products",
            summary = "Get product by ID",
            description = "Fetch one non-deleted product with its variants and media.")
    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_FETCHED, productService.getProductById(id));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Add product variant",
            description = "Add a new variant to an existing non-deleted product.")
    @PostMapping("/products/{productId}/variants")
    public ApiResponse<ProductVariantResponse> addNewProductVariants(
            @PathVariable Long productId, @RequestBody @Valid ProductVariantRequest productVariantRequest) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_VARIANT_CREATED,
                productService.addNewProductVariants(productId, productVariantRequest));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Get variant by ID",
            description = "Fetch one non-deleted variant that belongs to a non-deleted product.")
    @GetMapping("/products/variants/{id}")
    public ApiResponse<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_VARIANT_FETCHED, productService.getVariantById(id));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Update product",
            description = "Update product information such as name, description, brand, category, or active status.")
    @PutMapping("/products/{id}")
    public ApiResponse<ProductResponse> updateProductById(
            @RequestBody @Valid ProductUpdateRequest productUpdateRequest, @PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_UPDATED, productService.updateProductById(productUpdateRequest, id));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Toggle product status",
            description = "Toggle the active status of a non-deleted product.")
    @PatchMapping("/products/{id}/status")
    public ApiResponse<ProductResponse> updateProductStatus(@PathVariable Long id) {
        return ApiResponse.of(ResponseCode.PRODUCT_STATUS_UPDATED, productService.updateProductStatus(id));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Toggle variant status",
            description = "Toggle the active status of a non-deleted product variant.")
    @PatchMapping("/products/variants/{variantId}/status")
    public ApiResponse<ProductVariantResponse> updateProductVariantStatus(@PathVariable Long variantId) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_VARIANT_STATUS_UPDATED, productService.updateProductVariantStatus(variantId));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Update product variant",
            description = "Update a non-deleted product variant.")
    @PutMapping("/products/variants/{id}")
    public ApiResponse<ProductVariantResponse> updateVariantById(
            @RequestBody @Valid ProductVariantUpdateRequest productVariantUpdateRequest, @PathVariable Long id) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_VARIANT_UPDATED,
                productService.updateVariantById(productVariantUpdateRequest, id));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Delete product variant",
            description = "Soft delete a product variant.")
    @DeleteMapping("/products/variants/{id}")
    public ApiResponse<Void> deleteProductVariantsById(@PathVariable Long id) {
        productService.deleteProductVariantsById(id);
        return ApiResponse.of(ResponseCode.PRODUCT_VARIANT_DELETED, null);
    }

    // media

    @Operation(
            tags = "Admin Product Media",
            summary = "Add product media",
            description = "Add a new image or media item to an existing non-deleted product.")
    @PostMapping("/products/{productId}/media")
    public ApiResponse<ProductMediaResponse> createProductMedia(
            @PathVariable Long productId, @RequestBody @Valid ProductMediaRequest productMediaRequest) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_MEDIA_CREATED, productService.createProductMedia(productId, productMediaRequest));
    }

    @Operation(
            tags = "Admin Product Media",
            summary = "Update product media",
            description = "Update a non-deleted product media item.")
    @PutMapping("/products/media/{mediaId}")
    public ApiResponse<ProductMediaResponse> updateProductMediaById(
            @PathVariable Long mediaId, @RequestBody @Valid ProductMediaUpdateRequest productMediaUpdateRequest) {
        return ApiResponse.of(
                ResponseCode.PRODUCT_MEDIA_UPDATED,
                productService.updateProductMediaById(mediaId, productMediaUpdateRequest));
    }

    @Operation(
            tags = "Admin Product Media",
            summary = "Delete product media",
            description = "Soft delete a product media item.")
    @DeleteMapping("/products/media/{mediaId}")
    public ApiResponse<Void> deleteProductMediaById(@PathVariable Long mediaId) {
        productService.deleteProductMediaById(mediaId);
        return ApiResponse.of(ResponseCode.PRODUCT_MEDIA_DELETED, null);
    }
}
