package com.nguyendat.ecommerce.mapper;

import org.mapstruct.*;

import com.nguyendat.ecommerce.dto.request.product.ProductMediaRequest;
import com.nguyendat.ecommerce.dto.request.product.ProductMediaUpdateRequest;
import com.nguyendat.ecommerce.dto.response.ProductMediaResponse;
import com.nguyendat.ecommerce.entity.ProductMedia;

@Mapper(componentModel = "spring")
public interface ProductMediaMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductMedia toProductMedia(ProductMediaRequest request);

    ProductMediaResponse toProductMediaResponse(ProductMedia media);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProductMedia(
            @MappingTarget ProductMedia productMedia, ProductMediaUpdateRequest productMediaUpdateRequest);
}

