package com.NguyenDat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.product.*;
import com.NguyenDat.ecommerce.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.mapper.ProductMapper;
import com.NguyenDat.ecommerce.mapper.ProductMediaMapper;
import com.NguyenDat.ecommerce.mapper.ProductVariantMapper;
import com.NguyenDat.ecommerce.repository.*;
import com.NguyenDat.ecommerce.service.ProductService;
import com.NguyenDat.ecommerce.util.SkuUtil;
import com.NguyenDat.ecommerce.util.SlugUtil;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    ProductRepository productRepository;
    ProductVariantRepository productVariantRepository;
    ProductMediaRepository productMediaRepository;
    ProductMapper productMapper;
    ProductVariantMapper productVariantMapper;
    ProductMediaMapper productMediaMapper;

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest productCreateRequest) {
        Brand brand = brandRepository
                .findByIdAndDeletedFalse(productCreateRequest.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        Category category = categoryRepository
                .findByIdAndDeletedFalse(productCreateRequest.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        if (!category.isActive()) {
            throw new AppException(ErrorCode.CATEGORY_INACTIVE);
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

    @Transactional
    public ProductVariantResponse addNewProductVariants(
            Long productId, @Valid ProductVariantRequest productVariantRequest) {
        Product product = productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (productVariantRequest.getPrice() < productVariantRequest.getSalePrice()) {
            throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SALE_PRICE);
        }

        String sku = SkuUtil.toUniqueSku(
                product.getName(), productVariantRequest.getVariantName(), productVariantRepository::existsBySku);

        ProductVariant productVariant = productVariantMapper.toProductVariant(productVariantRequest);
        productVariant.setSku(sku);
        productVariant.setProduct(product);

        return productVariantMapper.toProductVariantResponse(productVariantRepository.save(productVariant));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAllByDeletedFalse().stream()
                .map(this::toProductResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return toProductResponse(product);
    }

    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        return productVariantMapper.toProductVariantResponse(productVariant);
    }

    @Transactional
    public ProductResponse updateProductById(@Valid ProductUpdateRequest productUpdateRequest, Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        String oldName = product.getName();
        productMapper.updateProduct(product, productUpdateRequest);
        if (productUpdateRequest.getName() != null
                && !productUpdateRequest.getName().equals(oldName)) {
            product.setSlug(SlugUtil.toUniqueSlug(
                    productUpdateRequest.getName(), slug -> productRepository.existsBySlugAndIdNot(slug, id)));
        }
        if (productUpdateRequest.getBrandId() != null) {
            Brand brand = brandRepository
                    .findByIdAndDeletedFalse(productUpdateRequest.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            if (!brand.isActive()) {
                throw new AppException(ErrorCode.BRAND_INACTIVE);
            }
            product.setBrand(brand);
        }
        if (productUpdateRequest.getCategoryId() != null) {
            Category category = categoryRepository
                    .findByIdAndDeletedFalse(productUpdateRequest.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            if (!category.isActive()) {
                throw new AppException(ErrorCode.CATEGORY_INACTIVE);
            }
            product.setCategory(category);
        }
        Product savedProduct = productRepository.save(product);
        return toProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProductStatus(Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(!product.isActive());
        Product savedProduct = productRepository.save(product);
        return toProductResponse(savedProduct);
    }

    @Transactional
    public ProductVariantResponse updateVariantById(
            @Valid ProductVariantUpdateRequest productVariantUpdateRequest, Long id) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
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

    @Transactional
    public ProductVariantResponse updateProductVariantStatus(Long variantId) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        productVariant.setActive(!productVariant.isActive());
        ProductVariant productVariantSaved = productVariantRepository.save(productVariant);
        return productVariantMapper.toProductVariantResponse(productVariantSaved);
    }

    @Transactional
    public void deleteProductVariantsById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
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
                .filter(media -> !media.isDeleted())
                .sorted(Comparator.comparingInt(ProductMedia::getSortOrder))
                .map(productMediaMapper::toProductMediaResponse)
                .toList());
        return response;
    }

    @Transactional
    public ProductMediaResponse createProductMedia(Long productId, ProductMediaRequest productMediaRequest) {
        Product product = productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (productMediaRepository.existsByProductIdAndUrlAndDeletedFalse(productId, productMediaRequest.getUrl())) {
            throw new AppException(ErrorCode.PRODUCT_MEDIA_EXISTED);
        }

        ProductMedia productMedia = productMediaMapper.toProductMedia(productMediaRequest);
        productMedia.setProduct(product);

        ProductMedia savedProductMedia = productMediaRepository.save(productMedia);
        return productMediaMapper.toProductMediaResponse(savedProductMedia);
    }

    @Transactional
    public ProductMediaResponse updateProductMediaById(
            Long mediaId, @Valid ProductMediaUpdateRequest productMediaUpdateRequest) {
        ProductMedia productMedia = productMediaRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_MEDIA_NOT_FOUND));

        String newUrl = productMediaUpdateRequest.getUrl() == null
                ? null
                : productMediaUpdateRequest.getUrl().trim();
        if (newUrl != null
                && !newUrl.equals(productMedia.getUrl())
                && productMediaRepository.existsByProductIdAndUrlAndDeletedFalseAndIdNot(
                        productMedia.getProduct().getId(), newUrl, mediaId)) {
            throw new AppException(ErrorCode.PRODUCT_MEDIA_EXISTED);
        }

        productMediaMapper.updateProductMedia(productMedia, productMediaUpdateRequest);
        return productMediaMapper.toProductMediaResponse(productMediaRepository.save(productMedia));
    }

    @Transactional
    public void deleteProductMediaById(Long mediaId) {
        ProductMedia productMedia = productMediaRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_MEDIA_NOT_FOUND));
        productMedia.setDeleted(true);
        productMedia.setActive(false);
        productMediaRepository.save(productMedia);
    }

    @Override
    public List<ProductResponse> showAllProducts() {
        return productRepository.findAllByDeletedFalseAndActiveTrue().stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    @Override
    public ProductResponse showProductBySlug(String slug) {
        String normalizedSlug = slug.trim();
        Product product = productRepository
                .findBySlugAndDeletedFalseAndActiveTrue(normalizedSlug)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }
}
