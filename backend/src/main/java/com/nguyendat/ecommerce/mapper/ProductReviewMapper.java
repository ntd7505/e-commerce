package com.nguyendat.ecommerce.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewCreateRequest;
import com.nguyendat.ecommerce.dto.request.product_review.ProductReviewMediaRequest;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewMediaResponse;
import com.nguyendat.ecommerce.dto.response.product_review.ProductReviewResponse;
import com.nguyendat.ecommerce.entity.ProductReview;
import com.nguyendat.ecommerce.entity.ProductReviewMedia;

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
    @Mapping(target = "productSlug", source = "product.slug")
    @Mapping(
            target = "thumbnailUrl",
            expression =
                    "java(productReview.getProduct() != null ? com.nguyendat.ecommerce.common.util.MediaUtils.resolveThumbnailUrl(productReview.getProduct().getMedia()) : null)")
    @Mapping(target = "variantName", source = "orderItem.productVariant.variantName")
    @Mapping(target = "sku", source = "orderItem.productVariant.sku")
    @Mapping(target = "verifiedPurchase", constant = "true")
    ProductReviewResponse toProductReviewResponse(ProductReview productReview);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "review", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ProductReviewMedia toProductReviewMedia(ProductReviewMediaRequest productReviewMediaRequest);

    ProductReviewMediaResponse toProductReviewMediaResponse(ProductReviewMedia productReviewMedia);
}

