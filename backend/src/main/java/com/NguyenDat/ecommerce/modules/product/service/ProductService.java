package com.NguyenDat.ecommerce.modules.product.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.repository.CategoryRepository;
import com.NguyenDat.ecommerce.modules.product.dto.request.*;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductMediaResponse;
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
import com.NguyenDat.ecommerce.modules.product.repository.ProductMediaRepository;
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
    ProductMediaRepository productMediaRepository;
    ProductMapper productMapper;
    ProductVariantMapper productVariantMapper;
    ProductMediaMapper productMediaMapper;

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

    public void deleteProductMediaById(Long mediaId) {
        ProductMedia productMedia = productMediaRepository
                .findByIdAndDeletedFalse(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_MEDIA_NOT_FOUND));
        productMedia.setDeleted(true);
        productMedia.setActive(false);
        productMediaRepository.save(productMedia);
    }
}
