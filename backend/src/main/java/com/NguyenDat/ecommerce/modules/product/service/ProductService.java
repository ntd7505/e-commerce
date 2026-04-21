package com.NguyenDat.ecommerce.modules.product.service;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.repository.CategoryRepository;
import com.NguyenDat.ecommerce.modules.product.dto.request.*;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.modules.product.entity.Brand;
import com.NguyenDat.ecommerce.modules.product.entity.Product;
import com.NguyenDat.ecommerce.modules.product.entity.ProductMedia;
import com.NguyenDat.ecommerce.modules.product.entity.ProductVariant;
import com.NguyenDat.ecommerce.modules.product.mapper.ProductMapper;
import com.NguyenDat.ecommerce.modules.product.mapper.ProductMediaMapper;
import com.NguyenDat.ecommerce.modules.product.mapper.ProductVariantMapper;
import com.NguyenDat.ecommerce.modules.product.repository.BrandRepository;
import com.NguyenDat.ecommerce.modules.product.repository.ProductRepository;
import com.NguyenDat.ecommerce.modules.product.repository.ProductVariantRepository;
import com.NguyenDat.ecommerce.util.SkuUtil;
import com.NguyenDat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {

    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    ProductRepository productRepository;
    ProductVariantRepository productVariantRepository;
    ProductMapper productMapper;
    ProductVariantMapper productVariantMapper;
    ProductMediaMapper productMediaMapper;

    public ProductResponse createProduct(ProductCreateRequest productCreateRequest) {
        Brand brand = brandRepository
                .findById(productCreateRequest.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        Category category = categoryRepository
                .findById(productCreateRequest.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (category.isDeleted()) {
            throw new AppException(ErrorCode.CATEGORY_DELETED);
        }
        if (!category.isActive()) {
            throw new AppException(ErrorCode.CATEGORY_INACTIVE);
        }
        if (brand.isDeleted()) {
            throw new AppException(ErrorCode.BRAND_DELETED);
        }
        if (!brand.isActive()) {
            throw new AppException(ErrorCode.BRAND_INACTIVE);
        }
        Product product = productMapper.toProduct(productCreateRequest);
        product.setSlug(SlugUtil.toUniqueSlug(productCreateRequest.getName(), productRepository::existsBySlug));
        product.setBrand(brand);
        product.setCategory(category);
        // variant
        List<ProductVariant> productVariantList = new ArrayList<>();
        for (ProductVariantRequest variant : productCreateRequest.getVariants()) {
            if (variant.getPrice() < variant.getSalePrice()) {
                throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SALE_PRICE);
            }
            ProductVariant productVariant = productVariantMapper.toProductVariant(variant);
            String sku = SkuUtil.toUniqueSku(
                    productCreateRequest.getName(), variant.getVariantName(), productVariantRepository::existsBySku);
            productVariant.setSku(sku);
            productVariant.setProduct(product);
            productVariantList.add(productVariant);
        }
        // media
        List<ProductMedia> productMediaList = new ArrayList<>();
        if (productCreateRequest.getMedia() != null) {
            for (ProductMediaRequest media : productCreateRequest.getMedia()) {
                ProductMedia productMedia = productMediaMapper.toProductMedia(media);
                productMedia.setProduct(product);
                productMediaList.add(productMedia);
            }
        }
        product.setVariants(productVariantList);
        product.setMedia(productMediaList);
        Product savedProduct = productRepository.save(product);
        return toProductResponse(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .filter(product -> !product.isDeleted())
                .map(this::toProductResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product =
                productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (product.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_DELETED);
        }
        return toProductResponse(product);
    }

    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        if (productVariant.getProduct().isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_DELETED);
        }
        if (productVariant.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_VARIANT_DELETED);
        }
        return productVariantMapper.toProductVariantResponse(productVariant);
    }

    public ProductResponse updateProductById(@Valid ProductUpdateRequest productUpdateRequest, Long id) {
        Product product =
                productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (product.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_DELETED);
        }
        String oldName = product.getName();
        productMapper.updateProduct(product, productUpdateRequest);
        if (productUpdateRequest.getName() != null
                && !productUpdateRequest.getName().equals(oldName)) {
            product.setSlug(SlugUtil.toUniqueSlug(
                    productUpdateRequest.getName(), slug -> productRepository.existsBySlugAndIdNot(slug, id)));
        }
        if (productUpdateRequest.getBrandId() != null) {
            Brand brand = brandRepository
                    .findById(productUpdateRequest.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            if (brand.isDeleted()) {
                throw new AppException(ErrorCode.BRAND_DELETED);
            }
            if (!brand.isActive()) {
                throw new AppException(ErrorCode.BRAND_INACTIVE);
            }
            product.setBrand(brand);
        }
        if (productUpdateRequest.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(productUpdateRequest.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            if (category.isDeleted()) {
                throw new AppException(ErrorCode.CATEGORY_DELETED);
            }
            if (!category.isActive()) {
                throw new AppException(ErrorCode.CATEGORY_INACTIVE);
            }
            product.setCategory(category);
        }
        Product savedProduct = productRepository.save(product);
        return toProductResponse(savedProduct);
    }

    public ProductVariantResponse updateVariantById(
            @Valid ProductVariantUpdateRequest productVariantUpdateRequest, Long id) {
        ProductVariant productVariant = productVariantRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        if (productVariant.getProduct().isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_DELETED);
        }
        if (productVariant.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_VARIANT_DELETED);
        }
        String oldName = productVariant.getVariantName();
        double finalPrice = productVariantUpdateRequest.getPrice() != null
                ? productVariantUpdateRequest.getPrice()
                : productVariant.getPrice();
        double finalSalePrice = productVariantUpdateRequest.getSalePrice() != null
                ? productVariantUpdateRequest.getSalePrice()
                : productVariant.getSalePrice();
        if (finalPrice < finalSalePrice) {
            throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SALE_PRICE);
        }
        productVariantMapper.updateProductVariant(productVariant, productVariantUpdateRequest);
        if (productVariantUpdateRequest.getVariantName() != null
                && !productVariantUpdateRequest.getVariantName().equals(oldName)) {
            productVariant.setSku(SkuUtil.toUniqueSku(
                    productVariant.getProduct().getName(),
                    productVariantUpdateRequest.getVariantName(),
                    sku -> productVariantRepository.existsBySkuAndIdNot(sku, id)));
        }
        return productVariantMapper.toProductVariantResponse(productVariantRepository.save(productVariant));
    }

    public void deleteProductVariantsById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        if (productVariant.isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_VARIANT_DELETED);
        }
        if (productVariant.getProduct().isDeleted()) {
            throw new AppException(ErrorCode.PRODUCT_DELETED);
        }
        productVariant.setDeleted(true);
        productVariant.setActive(false);

        productVariantRepository.save(productVariant);
    }

    private ProductResponse toProductResponse(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);
        response.setVariants(product.getVariants().stream()
                .filter(variant -> !variant.isDeleted())
                .map(productVariantMapper::toProductVariantResponse)
                .toList());
        response.setMedia(product.getMedia().stream()
                .map(productMediaMapper::toProductMediaResponse)
                .toList());
        return response;
    }
}
