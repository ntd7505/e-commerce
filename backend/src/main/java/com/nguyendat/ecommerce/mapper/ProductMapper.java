package com.nguyendat.ecommerce.mapper;

import org.mapstruct.*;

import com.nguyendat.ecommerce.dto.request.product.ProductCreateRequest;
import com.nguyendat.ecommerce.dto.request.product.ProductUpdateRequest;
import com.nguyendat.ecommerce.dto.response.ProductResponse;
import com.nguyendat.ecommerce.entity.Product;

@Mapper(
        componentModel = "spring",
        uses = {BrandMapper.class, CategoryMapper.class, ProductVariantMapper.class, ProductMediaMapper.class})
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "descriptionBlocks", ignore = true)
    @Mapping(target = "specifications", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ProductCreateRequest productCreateRequest);

    @Mapping(
            target = "thumbnailUrl",
            expression = "java(com.nguyendat.ecommerce.common.util.MediaUtils.resolveThumbnailUrl(product.getMedia()))")
    ProductResponse toProductResponse(Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "descriptionBlocks", ignore = true)
    @Mapping(target = "specifications", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest productUpdateRequest);
}

