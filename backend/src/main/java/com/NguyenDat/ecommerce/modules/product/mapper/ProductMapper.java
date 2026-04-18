package com.NguyenDat.ecommerce.modules.product.mapper;

import org.mapstruct.*;

import com.NguyenDat.ecommerce.modules.category.mapper.CategoryMapper;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductCreateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.request.ProductUpdateRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductResponse;
import com.NguyenDat.ecommerce.modules.product.entity.Product;

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
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ProductCreateRequest productCreateRequest);

    ProductResponse toProductResponse(Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest productUpdateRequest);
}
