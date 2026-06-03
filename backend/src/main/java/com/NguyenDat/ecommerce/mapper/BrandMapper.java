package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.request.BrandRequest;
import com.NguyenDat.ecommerce.dto.response.BrandResponse;
import com.NguyenDat.ecommerce.dto.response.BrandSummaryResponse;
import com.NguyenDat.ecommerce.entity.Brand;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "productList", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Brand toBrand(BrandRequest brandRequest);

    BrandResponse toBrandResponse(Brand brand);

    BrandSummaryResponse toBrandSummaryResponse(Brand brand);
}
