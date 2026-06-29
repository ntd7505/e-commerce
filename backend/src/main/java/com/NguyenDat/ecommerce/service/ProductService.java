package com.NguyenDat.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.dto.request.product.*;
import com.NguyenDat.ecommerce.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;

public interface ProductService {
    ProductResponse createProduct(ProductCreateRequest productCreateRequest);

    ProductVariantResponse addNewProductVariants(Long productId, ProductVariantRequest productVariantRequest);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    ProductVariantResponse getVariantById(Long id);

    ProductResponse updateProductById(ProductUpdateRequest productUpdateRequest, Long id);

    ProductResponse updateProductStatus(Long id);

    ProductVariantResponse updateVariantById(ProductVariantUpdateRequest productVariantUpdateRequest, Long id);

    ProductVariantResponse updateProductVariantStatus(Long variantId);

    void deleteProductVariantsById(Long id);

    ProductMediaResponse createProductMedia(Long productId, ProductMediaRequest productMediaRequest);

    ProductMediaResponse updateProductMediaById(Long mediaId, ProductMediaUpdateRequest productMediaUpdateRequest);

    void deleteProductMediaById(Long mediaId);

    ProductResponse updateProductDescriptionBlocks(
            Long productId, ProductDescriptionBlockBulkRequest productDescriptionBlockBulkRequest);

    ProductResponse updateProductSpecifications(
            Long productId, ProductSpecificationBulkRequest productSpecificationBulkRequest);

    List<ProductResponse> showAllProducts();

    ProductResponse showProductBySlug(String slug);

    void deleteProductById(Long id);

    PageResponse<ProductResponse> getAllProductsInPage(ProductFilterRequest filterRequest, Pageable pageable);

    PageResponse<ProductResponse> showProductsInPage(ProductFilterRequest filterRequest, Pageable pageable);

    PageResponse<ProductResponse> showRelatedProducts(String slug, Pageable pageable);
}
