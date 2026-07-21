package com.nguyendat.ecommerce.mapper;

import org.mapstruct.*;

import com.nguyendat.ecommerce.dto.request.product.ProductDescriptionBlockRequest;
import com.nguyendat.ecommerce.dto.response.ProductDescriptionBlockResponse;
import com.nguyendat.ecommerce.entity.ProductDescriptionBlock;

@Mapper(componentModel = "spring")
public interface ProductDescriptionBlockMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductDescriptionBlock toProductDescriptionBlock(ProductDescriptionBlockRequest request);

    ProductDescriptionBlockResponse toProductDescriptionBlockResponse(ProductDescriptionBlock block);
}

