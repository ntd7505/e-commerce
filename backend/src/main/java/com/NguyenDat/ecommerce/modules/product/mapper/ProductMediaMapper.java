package com.NguyenDat.ecommerce.modules.product.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.modules.product.dto.request.ProductMediaRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.ProductMediaResponse;
import com.NguyenDat.ecommerce.modules.product.entity.ProductMedia;

@Mapper(componentModel = "spring")
public interface ProductMediaMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductMedia toProductMedia(ProductMediaRequest request);

    ProductMediaResponse toProductMediaResponse(ProductMedia media);
}
