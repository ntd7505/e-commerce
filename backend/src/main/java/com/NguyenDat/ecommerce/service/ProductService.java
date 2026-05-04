package com.NguyenDat.ecommerce.service;

import java.util.List;

import com.NguyenDat.ecommerce.dto.request.ProductCreateRequest;
import com.NguyenDat.ecommerce.dto.request.ProductMediaRequest;
import com.NguyenDat.ecommerce.dto.request.ProductMediaUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.ProductUpdateRequest;
import com.NguyenDat.ecommerce.dto.request.ProductVariantRequest;
import com.NguyenDat.ecommerce.dto.request.ProductVariantUpdateRequest;
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
}
