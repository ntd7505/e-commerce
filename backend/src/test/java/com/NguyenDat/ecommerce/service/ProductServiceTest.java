package com.NguyenDat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.modules.category.dto.CategorySummaryResponse;
import com.NguyenDat.ecommerce.modules.category.entity.Category;
import com.NguyenDat.ecommerce.modules.category.repository.CategoryRepository;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductCreateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductMediaRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductMediaUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductVariantRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductVariantUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandSummaryResponse;
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
import com.NguyenDat.ecommerce.modules.product.service.ProductService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductServiceTest {

    @Mock
    CategoryRepository categoryRepository;

    @Mock
    BrandRepository brandRepository;

    @Mock
    ProductRepository productRepository;

    @Mock
    ProductVariantRepository productVariantRepository;

    @Mock
    ProductMediaRepository productMediaRepository;

    @Mock
    ProductMapper productMapper;

    @Mock
    ProductVariantMapper productVariantMapper;

    @Mock
    ProductMediaMapper productMediaMapper;

    @InjectMocks
    ProductService productService;

    ProductCreateRequest productCreateRequest;
    ProductMediaRequest productMediaRequest;
    ProductUpdateRequest productUpdateRequest;
    ProductMediaUpdateRequest productMediaUpdateRequest;
    ProductVariantUpdateRequest productVariantUpdateRequest;
    Brand brand;
    Category category;
    Product product;
    Product deletedProduct;
    ProductVariant productVariant;
    ProductMedia productMedia;
    ProductResponse productResponse;
    ProductVariantResponse productVariantResponse;
    ProductMediaResponse productMediaResponse;

    @BeforeEach
    void setUp() {
        ProductVariantRequest productVariantRequest = ProductVariantRequest.builder()
                .variantName("Den - M")
                .stockQuantity(10)
                .price(350000)
                .salePrice(289000)
                .currency("VND")
                .build();

        productMediaRequest = ProductMediaRequest.builder()
                .url("https://cdn.test/product.jpg")
                .mediaType("image")
                .sortOrder(0)
                .altText("Product image")
                .build();

        productCreateRequest = ProductCreateRequest.builder()
                .name("Ao Hoodie")
                .shortDescription("Hoodie form rong")
                .description("Mo ta san pham")
                .brandId(1L)
                .categoryId(2L)
                .active(true)
                .variants(List.of(productVariantRequest))
                .media(List.of(productMediaRequest))
                .build();

        productUpdateRequest = ProductUpdateRequest.builder()
                .name("Ao Hoodie Updated")
                .shortDescription("Hoodie updated")
                .description("Mo ta updated")
                .active(true)
                .build();

        productVariantUpdateRequest = ProductVariantUpdateRequest.builder()
                .variantName("Den - L")
                .price(360000.0)
                .salePrice(300000.0)
                .currency("VND")
                .active(true)
                .build();

        productMediaUpdateRequest = ProductMediaUpdateRequest.builder()
                .url("https://cdn.test/product-updated.jpg")
                .mediaType("image")
                .thumbnail(false)
                .sortOrder(1)
                .altText("Product image updated")
                .active(true)
                .build();

        brand = new Brand();
        brand.setId(1L);
        brand.setName("Nike");
        brand.setSlug("nike");
        brand.setActive(true);
        brand.setDeleted(false);

        category = Category.builder()
                .id(2L)
                .name("Hoodie")
                .slug("hoodie")
                .active(true)
                .deleted(false)
                .children(new ArrayList<>())
                .products(new ArrayList<>())
                .build();

        product = new Product();
        product.setId(10L);
        product.setName("Ao Hoodie");
        product.setSlug("ao-hoodie");
        product.setShortDescription("Hoodie form rong");
        product.setDescription("Mo ta san pham");
        product.setBrand(brand);
        product.setCategory(category);
        product.setActive(true);
        product.setDeleted(false);

        deletedProduct = new Product();
        deletedProduct.setId(11L);
        deletedProduct.setName("Deleted product");
        deletedProduct.setDeleted(true);
        deletedProduct.setVariants(new ArrayList<>());
        deletedProduct.setMedia(new ArrayList<>());

        productVariant = new ProductVariant();
        productVariant.setId(100L);
        productVariant.setVariantName("Den - M");
        productVariant.setStockQuantity(10);
        productVariant.setPrice(350000);
        productVariant.setSalePrice(289000);
        productVariant.setCurrency("VND");
        productVariant.setSku("AO-HOODIE-DEN-M");
        productVariant.setActive(true);
        productVariant.setDeleted(false);
        productVariant.setProduct(product);

        productMedia = new ProductMedia();
        productMedia.setId(200L);
        productMedia.setUrl("https://cdn.test/product.jpg");
        productMedia.setMediaType("image");
        productMedia.setThumbnail(true);
        productMedia.setSortOrder(0);
        productMedia.setAltText("Product image");
        productMedia.setActive(true);
        productMedia.setDeleted(false);
        productMedia.setProduct(product);

        product.setVariants(new ArrayList<>(List.of(productVariant)));
        product.setMedia(new ArrayList<>(List.of(productMedia)));

        productVariantResponse = ProductVariantResponse.builder()
                .id(100L)
                .variantName("Den - M")
                .stockQuantity(10)
                .price(350000)
                .salePrice(289000)
                .currency("VND")
                .sku("AO-HOODIE-DEN-M")
                .active(true)
                .build();

        productMediaResponse = ProductMediaResponse.builder()
                .id(200L)
                .url("https://cdn.test/product.jpg")
                .mediaType("image")
                .thumbnail(true)
                .sortOrder(0)
                .altText("Product image")
                .active(true)
                .build();

        productResponse = ProductResponse.builder()
                .id(10L)
                .name("Ao Hoodie")
                .slug("ao-hoodie")
                .shortDescription("Hoodie form rong")
                .description("Mo ta san pham")
                .brand(BrandSummaryResponse.builder()
                        .id(1L)
                        .name("Nike")
                        .slug("nike")
                        .build())
                .category(CategorySummaryResponse.builder()
                        .id(2L)
                        .name("Hoodie")
                        .slug("hoodie")
                        .build())
                .active(true)
                .build();
    }

    @Test
    void createProduct_shouldReturnProductResponse_whenRequestIsValid() {
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(brand));
        when(categoryRepository.findByIdAndDeletedFalse(2L)).thenReturn(Optional.of(category));
        when(productMapper.toProduct(productCreateRequest)).thenReturn(product);
        when(productRepository.existsBySlug("ao-hoodie")).thenReturn(false);
        when(productVariantRepository.existsBySku("AO-HOODIE-DEN-M")).thenReturn(false);
        when(productVariantMapper.toProductVariant(
                        productCreateRequest.getVariants().getFirst()))
                .thenReturn(productVariant);
        when(productMediaMapper.toProductMedia(productCreateRequest.getMedia().getFirst()))
                .thenReturn(productMedia);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductResponse result = productService.createProduct(productCreateRequest);

        assertEquals("Ao Hoodie", result.getName());
        assertEquals("ao-hoodie", result.getSlug());
        assertEquals(1, result.getVariants().size());
        assertEquals(1, result.getMedia().size());
        verify(productRepository).save(product);
    }

    @Test
    void createProduct_shouldThrowException_whenBrandIsNotFoundOrDeleted() {
        when(brandRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.empty());

        AppException exception =
                assertThrows(AppException.class, () -> productService.createProduct(productCreateRequest));

        assertEquals(ErrorCode.BRAND_NOT_FOUND, exception.getErrorCode());
        verify(productRepository, never()).save(any());
    }

    @Test
    void getAllProducts_shouldReturnOnlyNonDeletedProducts() {
        when(productRepository.findAllByDeletedFalse()).thenReturn(List.of(product));
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        List<ProductResponse> result = productService.getAllProducts();

        assertEquals(1, result.size());
        assertEquals("Ao Hoodie", result.getFirst().getName());
        verify(productRepository).findAllByDeletedFalse();
    }

    @Test
    void getProductById_shouldReturnProductResponse_whenProductExists() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductResponse result = productService.getProductById(10L);

        assertEquals("Ao Hoodie", result.getName());
        assertEquals(1, result.getVariants().size());
        assertEquals(1, result.getMedia().size());
    }

    @Test
    void getProductById_shouldThrowException_whenProductIsNotFoundOrDeleted() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> productService.getProductById(10L));

        assertEquals(ErrorCode.PRODUCT_NOT_FOUND, exception.getErrorCode());
        verify(productMapper, never()).toProductResponse(any());
    }

    @Test
    void updateProductById_shouldReturnProductResponse_whenRequestIsValid() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        doAnswer(invocation -> {
                    product.setName(productUpdateRequest.getName());
                    product.setShortDescription(productUpdateRequest.getShortDescription());
                    product.setDescription(productUpdateRequest.getDescription());
                    return null;
                })
                .when(productMapper)
                .updateProduct(product, productUpdateRequest);
        when(productRepository.existsBySlugAndIdNot("ao-hoodie-updated", 10L)).thenReturn(false);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductResponse result = productService.updateProductById(productUpdateRequest, 10L);

        assertEquals("Ao Hoodie", result.getName());
        assertEquals("Ao Hoodie Updated", product.getName());
        verify(productRepository).save(product);
    }

    @Test
    void getVariantById_shouldReturnVariantResponse_whenVariantExists() {
        when(productVariantRepository.findByIdAndDeletedFalseAndProductDeletedFalse(100L))
                .thenReturn(Optional.of(productVariant));
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);

        ProductVariantResponse result = productService.getVariantById(100L);

        assertEquals("Den - M", result.getVariantName());
        assertEquals("AO-HOODIE-DEN-M", result.getSku());
    }

    @Test
    void getVariantById_shouldThrowException_whenVariantIsNotFoundOrDeleted() {
        when(productVariantRepository.findByIdAndDeletedFalseAndProductDeletedFalse(100L))
                .thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> productService.getVariantById(100L));

        assertEquals(ErrorCode.PRODUCT_VARIANT_NOT_FOUND, exception.getErrorCode());
        verify(productVariantMapper, never()).toProductVariantResponse(any());
    }

    @Test
    void addNewProductVariants_shouldReturnVariantResponse_whenRequestIsValid() {
        ProductVariantRequest productVariantRequest = ProductVariantRequest.builder()
                .variantName("Den - XL")
                .stockQuantity(8)
                .price(380000)
                .salePrice(320000)
                .currency("VND")
                .build();
        ProductVariant newProductVariant = new ProductVariant();
        newProductVariant.setVariantName("Den - XL");
        newProductVariant.setPrice(380000);
        newProductVariant.setSalePrice(320000);
        newProductVariant.setCurrency("VND");
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        when(productVariantRepository.existsBySku("AO-HOODIE-DEN-XL")).thenReturn(false);
        when(productVariantMapper.toProductVariant(productVariantRequest)).thenReturn(newProductVariant);
        when(productVariantRepository.save(newProductVariant)).thenReturn(newProductVariant);
        when(productVariantMapper.toProductVariantResponse(newProductVariant)).thenReturn(productVariantResponse);

        ProductVariantResponse result = productService.addNewProductVariants(10L, productVariantRequest);

        assertEquals("Den - M", result.getVariantName());
        assertEquals("AO-HOODIE-DEN-XL", newProductVariant.getSku());
        assertEquals(product, newProductVariant.getProduct());
        verify(productVariantRepository).save(newProductVariant);
    }

    @Test
    void addNewProductVariants_shouldThrowException_whenSalePriceIsGreaterThanPrice() {
        ProductVariantRequest productVariantRequest = ProductVariantRequest.builder()
                .variantName("Den - XL")
                .stockQuantity(8)
                .price(300000)
                .salePrice(320000)
                .currency("VND")
                .build();
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));

        AppException exception = assertThrows(
                AppException.class, () -> productService.addNewProductVariants(10L, productVariantRequest));

        assertEquals(ErrorCode.PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SALE_PRICE, exception.getErrorCode());
        verify(productVariantRepository, never()).save(any());
    }

    @Test
    void updateProductStatus_shouldToggleProductActive_whenProductExists() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductResponse result = productService.updateProductStatus(10L);

        assertEquals("Ao Hoodie", result.getName());
        assertFalse(product.isActive());
        verify(productRepository).save(product);
    }

    @Test
    void updateVariantById_shouldReturnVariantResponse_whenRequestIsValid() {
        when(productVariantRepository.findByIdAndDeletedFalseAndProductDeletedFalse(100L))
                .thenReturn(Optional.of(productVariant));
        doAnswer(invocation -> {
                    productVariant.setVariantName(productVariantUpdateRequest.getVariantName());
                    productVariant.setPrice(productVariantUpdateRequest.getPrice());
                    productVariant.setSalePrice(productVariantUpdateRequest.getSalePrice());
                    productVariant.setCurrency(productVariantUpdateRequest.getCurrency());
                    productVariant.setActive(productVariantUpdateRequest.getActive());
                    return null;
                })
                .when(productVariantMapper)
                .updateProductVariant(productVariant, productVariantUpdateRequest);
        when(productVariantRepository.existsBySkuAndIdNot("AO-HOODIE-DEN-L", 100L))
                .thenReturn(false);
        when(productVariantRepository.save(productVariant)).thenReturn(productVariant);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);

        ProductVariantResponse result = productService.updateVariantById(productVariantUpdateRequest, 100L);

        assertEquals("Den - M", result.getVariantName());
        assertEquals("Den - L", productVariant.getVariantName());
        verify(productVariantRepository).save(productVariant);
    }

    @Test
    void updateProductVariantStatus_shouldToggleVariantActive_whenVariantExists() {
        when(productVariantRepository.findByIdAndDeletedFalseAndProductDeletedFalse(100L))
                .thenReturn(Optional.of(productVariant));
        when(productVariantRepository.save(productVariant)).thenReturn(productVariant);
        when(productVariantMapper.toProductVariantResponse(productVariant)).thenReturn(productVariantResponse);

        ProductVariantResponse result = productService.updateProductVariantStatus(100L);

        assertEquals("Den - M", result.getVariantName());
        assertFalse(productVariant.isActive());
        verify(productVariantRepository).save(productVariant);
    }

    @Test
    void createProductMedia_shouldReturnMediaResponse_whenRequestIsValid() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        when(productMediaRepository.existsByProductIdAndUrlAndDeletedFalse(10L, productMediaRequest.getUrl()))
                .thenReturn(false);
        when(productMediaMapper.toProductMedia(productMediaRequest)).thenReturn(productMedia);
        when(productMediaRepository.save(productMedia)).thenReturn(productMedia);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductMediaResponse result = productService.createProductMedia(10L, productMediaRequest);

        assertEquals("https://cdn.test/product.jpg", result.getUrl());
        assertEquals(product, productMedia.getProduct());
        verify(productMediaRepository).save(productMedia);
    }

    @Test
    void createProductMedia_shouldThrowException_whenMediaAlreadyExists() {
        when(productRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(product));
        when(productMediaRepository.existsByProductIdAndUrlAndDeletedFalse(10L, productMediaRequest.getUrl()))
                .thenReturn(true);

        AppException exception =
                assertThrows(AppException.class, () -> productService.createProductMedia(10L, productMediaRequest));

        assertEquals(ErrorCode.PRODUCT_MEDIA_EXISTED, exception.getErrorCode());
        verify(productMediaRepository, never()).save(any());
    }

    @Test
    void updateProductMediaById_shouldReturnMediaResponse_whenRequestIsValid() {
        when(productMediaRepository.findByIdAndDeletedFalseAndProductDeletedFalse(200L))
                .thenReturn(Optional.of(productMedia));
        when(productMediaRepository.existsByProductIdAndUrlAndDeletedFalseAndIdNot(
                        10L, productMediaUpdateRequest.getUrl(), 200L))
                .thenReturn(false);
        doAnswer(invocation -> {
                    productMedia.setUrl(productMediaUpdateRequest.getUrl());
                    productMedia.setMediaType(productMediaUpdateRequest.getMediaType());
                    productMedia.setThumbnail(productMediaUpdateRequest.getThumbnail());
                    productMedia.setSortOrder(productMediaUpdateRequest.getSortOrder());
                    productMedia.setAltText(productMediaUpdateRequest.getAltText());
                    productMedia.setActive(productMediaUpdateRequest.getActive());
                    return null;
                })
                .when(productMediaMapper)
                .updateProductMedia(productMedia, productMediaUpdateRequest);
        when(productMediaRepository.save(productMedia)).thenReturn(productMedia);
        when(productMediaMapper.toProductMediaResponse(productMedia)).thenReturn(productMediaResponse);

        ProductMediaResponse result = productService.updateProductMediaById(200L, productMediaUpdateRequest);

        assertEquals("https://cdn.test/product.jpg", result.getUrl());
        assertEquals("https://cdn.test/product-updated.jpg", productMedia.getUrl());
        verify(productMediaRepository).save(productMedia);
    }

    @Test
    void deleteProductMediaById_shouldMarkMediaAsDeleted_whenMediaExists() {
        when(productMediaRepository.findByIdAndDeletedFalseAndProductDeletedFalse(200L))
                .thenReturn(Optional.of(productMedia));
        when(productMediaRepository.save(productMedia)).thenReturn(productMedia);

        productService.deleteProductMediaById(200L);

        assertTrue(productMedia.isDeleted());
        assertFalse(productMedia.isActive());
        verify(productMediaRepository).save(productMedia);
    }
}
