package com.NguyenDat.ecommerce.controller.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.NguyenDat.ecommerce.common.constant.AdminPermission;
import com.NguyenDat.ecommerce.common.constant.ApiConstant;
import com.NguyenDat.ecommerce.common.constant.ResponseCode;
import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.PageRequest;
import com.NguyenDat.ecommerce.dto.request.product.*;
import com.NguyenDat.ecommerce.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping(ApiConstant.ADMIN_PREFIX)
@PreAuthorize(AdminPermission.PRODUCT_ACCESS)
@Tag(name = "Admin Products", description = "Product, variant and media management APIs")
public class AdminProductController {

    ProductService productService;

    @Operation(
            tags = "Admin Products",
            summary = "Create product",
            description = "Create a new product with initial variants and media.")
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestBody @Valid ProductCreateRequest productCreateRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(ResponseCode.PRODUCT_CREATED, productService.createProduct(productCreateRequest)));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Get all products",
            description = "Fetch all non-deleted products for admin management.")
    @GetMapping("/products/all")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCTS_FETCHED, productService.getAllProducts()));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Get product by ID",
            description = "Fetch one non-deleted product with its variants and media.")
    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_FETCHED, productService.getProductById(id)));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Add product variant",
            description = "Add a new variant to an existing non-deleted product.")
    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> addNewProductVariants(
            @PathVariable Long productId, @RequestBody @Valid ProductVariantRequest productVariantRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        ResponseCode.PRODUCT_VARIANT_CREATED,
                        productService.addNewProductVariants(productId, productVariantRequest)));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Get variant by ID",
            description = "Fetch one non-deleted variant that belongs to a non-deleted product.")
    @GetMapping("/products/variants/{id}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> getVariantById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.PRODUCT_VARIANT_FETCHED, productService.getVariantById(id)));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Update product",
            description = "Update product information such as name, description, brand, category, or active status.")
    @PatchMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductById(
            @RequestBody @Valid ProductUpdateRequest productUpdateRequest, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_UPDATED, productService.updateProductById(productUpdateRequest, id)));
    }

    @Operation(
            tags = "Admin Products",
            summary = "Toggle product status",
            description = "Toggle the active status of a non-deleted product.")
    @PatchMapping("/products/{id}/status")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.of(ResponseCode.PRODUCT_STATUS_UPDATED, productService.updateProductStatus(id)));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Toggle variant status",
            description = "Toggle the active status of a non-deleted product variant.")
    @PatchMapping("/products/variants/{variantId}/status")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> updateProductVariantStatus(
            @PathVariable Long variantId) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_VARIANT_STATUS_UPDATED, productService.updateProductVariantStatus(variantId)));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Update product variant",
            description = "Update a non-deleted product variant.")
    @PatchMapping("/products/variants/{id}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> updateVariantById(
            @RequestBody @Valid ProductVariantUpdateRequest productVariantUpdateRequest, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_VARIANT_UPDATED,
                productService.updateVariantById(productVariantUpdateRequest, id)));
    }

    @Operation(
            tags = "Admin Product Variants",
            summary = "Delete product variant",
            description = "Soft delete a product variant.")
    @DeleteMapping("/products/variants/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProductVariantsById(@PathVariable Long id) {
        productService.deleteProductVariantsById(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_VARIANT_DELETED, null));
    }

    // media

    @Operation(
            tags = "Admin Product Media",
            summary = "Add product media",
            description = "Add a new image or media item to an existing non-deleted product.")
    @PostMapping("/products/{productId}/media")
    public ResponseEntity<ApiResponse<ProductMediaResponse>> createProductMedia(
            @PathVariable Long productId, @RequestBody @Valid ProductMediaRequest productMediaRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(
                        ResponseCode.PRODUCT_MEDIA_CREATED,
                        productService.createProductMedia(productId, productMediaRequest)));
    }

    @Operation(
            tags = "Admin Product Media",
            summary = "Update product media",
            description = "Update a non-deleted product media item.")
    @PatchMapping("/products/media/{mediaId}")
    public ResponseEntity<ApiResponse<ProductMediaResponse>> updateProductMediaById(
            @PathVariable Long mediaId, @RequestBody @Valid ProductMediaUpdateRequest productMediaUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_MEDIA_UPDATED,
                productService.updateProductMediaById(mediaId, productMediaUpdateRequest)));
    }

    @Operation(
            tags = "Admin Product Media",
            summary = "Delete product media",
            description = "Soft delete a product media item.")
    @DeleteMapping("/products/media/{mediaId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductMediaById(@PathVariable Long mediaId) {
        productService.deleteProductMediaById(mediaId);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_MEDIA_DELETED, null));
    }

    @PutMapping("/products/{productId}/description-blocks")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductDescriptionBlocks(
            @PathVariable Long productId,
            @RequestBody @Valid ProductDescriptionBlockBulkRequest request) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_DESCRIPTION_BLOCKS_UPDATED,
                productService.updateProductDescriptionBlocks(productId, request)));
    }

    @PutMapping("/products/{productId}/specifications")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductSpecifications(
            @PathVariable Long productId,
            @RequestBody @Valid ProductSpecificationBulkRequest request) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCT_SPECIFICATIONS_UPDATED,
                productService.updateProductSpecifications(productId, request)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProductById(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok(ApiResponse.of(ResponseCode.PRODUCT_DELETED, null));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsPage(
            @Valid PageRequest pageRequest, @Valid ProductFilterRequest filterRequest) {
        return ResponseEntity.ok(ApiResponse.of(
                ResponseCode.PRODUCTS_FETCHED,
                productService.getAllProductsInPage(filterRequest, pageRequest.toPageable())));
    }
}
