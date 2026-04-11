package com.NguyenDat.ecommerce.modules.product.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.modules.product.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.modules.product.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.modules.product.entity.Brand;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Brand toBrand(BrandRequest brandRequest);

    BrandResponse toBrandResponse(Brand brand);
}
