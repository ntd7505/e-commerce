package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.*;

import com.NguyenDat.ecommerce.dto.request.product.ProductDescriptionBlockRequest;
import com.NguyenDat.ecommerce.dto.response.ProductDescriptionBlockResponse;
import com.NguyenDat.ecommerce.entity.ProductDescriptionBlock;

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
