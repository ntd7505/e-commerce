package com.NguyenDat.ecommerce.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.constant.CacheName;
import com.NguyenDat.ecommerce.common.dto.response.PageResponse;
import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.dto.request.product.*;
import com.NguyenDat.ecommerce.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.entity.*;
import com.NguyenDat.ecommerce.mapper.ProductDescriptionBlockMapper;
import com.NguyenDat.ecommerce.mapper.ProductMapper;
import com.NguyenDat.ecommerce.mapper.ProductMediaMapper;
import com.NguyenDat.ecommerce.mapper.ProductSpecificationMapper;
import com.NguyenDat.ecommerce.mapper.ProductVariantMapper;
import com.NguyenDat.ecommerce.repository.*;
import com.NguyenDat.ecommerce.repository.specification.ProductSpecification;
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
    ProductDescriptionBlockMapper productDescriptionBlockMapper;
    ProductSpecificationMapper productSpecificationMapper;
    ProductDescriptionBlockRepository productDescriptionBlockRepository;
    ProductSpecificationRepository productSpecificationRepository;
    ProductReviewRepository productReviewRepository;
    OrderItemRepository orderItemRepository;

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
        // description blocks
        List<ProductDescriptionBlock> descriptionBlockList = new ArrayList<>();
        if (productCreateRequest.getDescriptionBlocks() != null) {
            for (ProductDescriptionBlockRequest blockReq : productCreateRequest.getDescriptionBlocks()) {
                ProductDescriptionBlock block = productDescriptionBlockMapper.toProductDescriptionBlock(blockReq);
                block.setProduct(product);
                block.setActive(blockReq.getActive() == null || blockReq.getActive());
                descriptionBlockList.add(block);
            }
        }
        // specifications
        List<com.NguyenDat.ecommerce.entity.ProductSpecification> specificationList = new ArrayList<>();
        if (productCreateRequest.getSpecifications() != null) {
            for (ProductSpecificationRequest specReq : productCreateRequest.getSpecifications()) {
                com.NguyenDat.ecommerce.entity.ProductSpecification spec =
                        productSpecificationMapper.toProductSpecification(specReq);
                spec.setProduct(product);
                spec.setGroupName(normalizeBlank(specReq.getGroupName()));
                spec.setSpecKey(specReq.getSpecKey().trim());
                spec.setSpecValue(specReq.getSpecValue().trim());
                spec.setActive(specReq.getActive() == null || specReq.getActive());
                specificationList.add(spec);
            }
        }
        product.setVariants(productVariantList);
        product.setMedia(productMediaList);
        product.setDescriptionBlocks(descriptionBlockList);
        product.setSpecifications(specificationList);
        Product savedProduct = productRepository.save(product);
        return enrichProductStats(toProductResponse(savedProduct));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
        List<ProductResponse> responses = productRepository.findAllByDeletedFalse().stream()
                .map(this::toProductResponse)
                .toList();
        enrichProductStats(responses);
        return responses;
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return enrichProductStats(toProductResponse(product));
    }

    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        return productVariantMapper.toProductVariantResponse(productVariant);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
        return enrichProductStats(toProductResponse(savedProduct));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public ProductResponse updateProductStatus(Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(!product.isActive());
        Product savedProduct = productRepository.save(product);
        return enrichProductStats(toProductResponse(savedProduct));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public ProductVariantResponse updateProductVariantStatus(Long variantId) {
        ProductVariant productVariant = productVariantRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));
        productVariant.setActive(!productVariant.isActive());
        ProductVariant productVariantSaved = productVariantRepository.save(productVariant);
        return productVariantMapper.toProductVariantResponse(productVariantSaved);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
        response.setDescriptionBlocks(product.getDescriptionBlocks().stream()
                .filter(block -> !block.isDeleted())
                .sorted(Comparator.comparingInt(ProductDescriptionBlock::getSortOrder))
                .map(productDescriptionBlockMapper::toProductDescriptionBlockResponse)
                .toList());
        response.setSpecifications(product.getSpecifications().stream()
                .filter(specification -> !specification.isDeleted())
                .sorted(Comparator.comparingInt(com.NguyenDat.ecommerce.entity.ProductSpecification::getSortOrder))
                .map(productSpecificationMapper::toProductSpecificationResponse)
                .toList());
        return response;
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
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
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public void deleteProductMediaById(Long mediaId) {
        ProductMedia productMedia = productMediaRepository
                .findByIdAndDeletedFalseAndProductDeletedFalse(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_MEDIA_NOT_FOUND));
        productMedia.setDeleted(true);
        productMedia.setActive(false);
        productMediaRepository.save(productMedia);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public ProductResponse updateProductDescriptionBlocks(
            Long productId, ProductDescriptionBlockBulkRequest productDescriptionBlockBulkRequest) {
        Product product = productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<ProductDescriptionBlock> existingBlocks =
                productDescriptionBlockRepository.findAllByProductIdAndDeletedFalseOrderBySortOrderAsc(productId);
        existingBlocks.forEach(block -> {
            block.setDeleted(true);
            block.setActive(false);
        });

        List<ProductDescriptionBlock> newBlocks = productDescriptionBlockBulkRequest.getBlocks().stream()
                .map(request -> {
                    ProductDescriptionBlock block = productDescriptionBlockMapper.toProductDescriptionBlock(request);
                    block.setProduct(product);
                    block.setActive(request.getActive() == null || request.getActive());
                    return block;
                })
                .toList();

        productDescriptionBlockRepository.saveAll(existingBlocks);
        productDescriptionBlockRepository.saveAll(newBlocks);

        return enrichProductStats(toProductResponse(productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND))));
    }

    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public ProductResponse updateProductSpecifications(
            Long productId, ProductSpecificationBulkRequest productSpecificationBulkRequest) {
        Product product = productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<com.NguyenDat.ecommerce.entity.ProductSpecification> existingSpecifications =
                productSpecificationRepository.findAllByProductIdAndDeletedFalseOrderBySortOrderAsc(productId);
        existingSpecifications.forEach(specification -> {
            specification.setDeleted(true);
            specification.setActive(false);
        });

        List<com.NguyenDat.ecommerce.entity.ProductSpecification> newSpecifications =
                productSpecificationBulkRequest.getSpecifications().stream()
                        .map(request -> {
                            com.NguyenDat.ecommerce.entity.ProductSpecification specification =
                                    productSpecificationMapper.toProductSpecification(request);
                            specification.setProduct(product);
                            specification.setGroupName(normalizeBlank(request.getGroupName()));
                            specification.setSpecKey(request.getSpecKey().trim());
                            specification.setSpecValue(request.getSpecValue().trim());
                            specification.setActive(request.getActive() == null || request.getActive());
                            return specification;
                        })
                        .toList();

        productSpecificationRepository.saveAll(existingSpecifications);
        productSpecificationRepository.saveAll(newSpecifications);

        return enrichProductStats(toProductResponse(productRepository
                .findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND))));
    }

    @Override
    public List<ProductResponse> showAllProducts() {
        List<ProductResponse> responses = productRepository.findAllByDeletedFalseAndActiveTrue().stream()
                .map(this::toClientProductResponse)
                .toList();
        enrichProductStats(responses);
        return responses;
    }

    @Override
    @Cacheable(cacheNames = CacheName.PRODUCT_DETAILS, key = "#slug.trim().toLowerCase()", sync = true)
    public ProductResponse showProductBySlug(String slug) {
        Product product = productRepository
                .findBySlugAndDeletedFalseAndActiveTrue(slug.trim())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return enrichProductStats(toClientProductResponse(product));
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = CacheName.PRODUCT_DETAILS, allEntries = true)
    public void deleteProductById(Long id) {
        Product product = productRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        product.setDeleted(true);
        product.setActive(false);

        product.getVariants().forEach(variant -> {
            variant.setDeleted(true);
            variant.setActive(false);
        });

        product.getMedia().forEach(media -> {
            media.setDeleted(true);
            media.setActive(false);
        });

        product.getDescriptionBlocks().forEach(block -> {
            block.setDeleted(true);
            block.setActive(false);
        });

        product.getSpecifications().forEach(specification -> {
            specification.setDeleted(true);
            specification.setActive(false);
        });

        productRepository.save(product);
    }

    @Override
    public PageResponse<ProductResponse> getAllProductsInPage(ProductFilterRequest filterRequest, Pageable pageable) {
        Page<Product> page = productRepository.findAll(ProductSpecification.withFilter(filterRequest, false), pageable);
        Page<ProductResponse> mappedPage = page.map(this::toProductResponse);
        enrichProductStats(mappedPage.getContent());
        return PageResponse.from(mappedPage);
    }

    @Override
    public PageResponse<ProductResponse> showProductsInPage(ProductFilterRequest filterRequest, Pageable pageable) {
        Page<Product> page = productRepository.findAll(ProductSpecification.withFilter(filterRequest, true), pageable);
        Page<ProductResponse> mappedPage = page.map(this::toClientProductResponse);
        enrichProductStats(mappedPage.getContent());
        return PageResponse.from(mappedPage);
    }

    @Override
    public PageResponse<ProductResponse> showRelatedProducts(String slug, Pageable pageable) {
        Product currentProduct = productRepository
                .findBySlugAndDeletedFalseAndActiveTrue(slug.trim())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Page<Product> relatedProducts = productRepository.findAllByCategoryIdAndIdNotAndActiveTrueAndDeletedFalse(
                currentProduct.getCategory().getId(), currentProduct.getId(), pageable);

        Page<ProductResponse> mappedPage = relatedProducts.map(this::toClientProductResponse);
        enrichProductStats(mappedPage.getContent());
        return PageResponse.from(mappedPage);
    }

    private ProductResponse toClientProductResponse(Product product) {
        ProductResponse response = productMapper.toProductResponse(product);

        response.setVariants(product.getVariants().stream()
                .filter(variant -> !variant.isDeleted() && variant.isActive())
                .map(productVariantMapper::toProductVariantResponse)
                .toList());

        response.setMedia(product.getMedia().stream()
                .filter(media -> !media.isDeleted() && media.isActive())
                .sorted(Comparator.comparingInt(ProductMedia::getSortOrder))
                .map(productMediaMapper::toProductMediaResponse)
                .toList());

        response.setDescriptionBlocks(product.getDescriptionBlocks().stream()
                .filter(block -> !block.isDeleted() && block.isActive())
                .sorted(Comparator.comparingInt(ProductDescriptionBlock::getSortOrder))
                .map(productDescriptionBlockMapper::toProductDescriptionBlockResponse)
                .toList());

        response.setSpecifications(product.getSpecifications().stream()
                .filter(specification -> !specification.isDeleted() && specification.isActive())
                .sorted(Comparator.comparingInt(com.NguyenDat.ecommerce.entity.ProductSpecification::getSortOrder))
                .map(productSpecificationMapper::toProductSpecificationResponse)
                .toList());

        return response;
    }

    private String normalizeBlank(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }

    private void enrichProductStats(List<ProductResponse> responses) {
        if (responses.isEmpty()) return;
        List<Long> productIds = responses.stream().map(ProductResponse::getId).toList();

        List<com.NguyenDat.ecommerce.repository.projection.ProductStatProjection> ratings =
                productReviewRepository.getAverageRatingByProductIds(productIds);
        java.util.Map<Long, Double> ratingMap = new java.util.HashMap<>();
        for (com.NguyenDat.ecommerce.repository.projection.ProductStatProjection row : ratings) {
            ratingMap.put(
                    row.getProductId(),
                    row.getStatValue() != null ? row.getStatValue().doubleValue() : 0.0);
        }

        List<com.NguyenDat.ecommerce.repository.projection.ProductStatProjection> soldCounts =
                orderItemRepository.getSoldCountByProductIds(productIds);
        java.util.Map<Long, Long> soldMap = new java.util.HashMap<>();
        for (com.NguyenDat.ecommerce.repository.projection.ProductStatProjection row : soldCounts) {
            soldMap.put(
                    row.getProductId(),
                    row.getStatValue() != null ? row.getStatValue().longValue() : 0L);
        }

        for (ProductResponse response : responses) {
            response.setRating(ratingMap.getOrDefault(response.getId(), 0.0));
            response.setSoldCount(soldMap.getOrDefault(response.getId(), 0L).intValue());
        }
    }

    private ProductResponse enrichProductStats(ProductResponse response) {
        enrichProductStats(List.of(response));
        return response;
    }
}
