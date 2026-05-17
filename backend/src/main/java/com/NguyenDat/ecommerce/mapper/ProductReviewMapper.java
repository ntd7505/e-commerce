package com.NguyenDat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.NguyenDat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.NguyenDat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.NguyenDat.ecommerce.entity.ProductReview;
import com.NguyenDat.ecommerce.entity.ProductReviewMedia;

@Mapper(componentModel = "spring")
public interface ProductReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    @Mapping(target = "media", ignore = true)
    @Mapping(target = "anonymous", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductReview toProductReview(ProductReviewCreateRequest productReviewCreateRequest);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "orderItemId", source = "orderItem.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "variantName", source = "orderItem.productVariant.variantName")
    @Mapping(target = "sku", source = "orderItem.productVariant.sku")
    ProductReviewResponse toProductReviewResponse(ProductReview productReview);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "review", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductReviewMedia toProductReviewMedia(ProductReviewMediaRequest productReviewMediaRequest);

    ProductReviewMediaResponse toProductReviewMediaResponse(ProductReviewMedia productReviewMedia);
}
