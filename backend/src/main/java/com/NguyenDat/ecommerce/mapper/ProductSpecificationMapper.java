package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.*;

import com.NguyenDat.ecommerce.dto.request.product.ProductSpecificationRequest;
import com.NguyenDat.ecommerce.dto.response.ProductSpecificationResponse;
import com.NguyenDat.ecommerce.entity.ProductSpecification;

@Mapper(componentModel = "spring")
public interface ProductSpecificationMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductSpecification toProductSpecification(ProductSpecificationRequest request);

    ProductSpecificationResponse toProductSpecificationResponse(ProductSpecification specification);
}
