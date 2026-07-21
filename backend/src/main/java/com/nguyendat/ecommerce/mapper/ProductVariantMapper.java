package com.nguyendat.ecommerce.mapper;

import org.mapstruct.*;

import com.nguyendat.ecommerce.dto.request.product.ProductVariantRequest;
import com.nguyendat.ecommerce.dto.request.product.ProductVariantUpdateRequest;
import com.nguyendat.ecommerce.dto.response.ProductVariantResponse;
import com.nguyendat.ecommerce.entity.ProductVariant;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "sku", ignore = true)
    ProductVariant toProductVariant(ProductVariantRequest productVariantRequest);

    ProductVariantResponse toProductVariantResponse(ProductVariant productVariant);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "sku", ignore = true)
    void updateProductVariant(
            @MappingTarget ProductVariant productVariant, ProductVariantUpdateRequest productVariantUpdateRequest);
}

