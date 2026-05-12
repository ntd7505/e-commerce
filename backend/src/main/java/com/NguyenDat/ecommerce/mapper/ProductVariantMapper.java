package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.*;

import com.NguyenDat.ecommerce.dto.request.product.ProductVariantRequest;
import com.NguyenDat.ecommerce.dto.request.product.ProductVariantUpdateRequest;
import com.NguyenDat.ecommerce.dto.response.ProductVariantResponse;
import com.NguyenDat.ecommerce.entity.ProductVariant;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    ProductVariant toProductVariant(ProductVariantRequest productVariantRequest);

    ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateProductVariant(
            @MappingTarget ProductVariant productVariant, ProductVariantUpdateRequest productVariantUpdateRequest);
}
