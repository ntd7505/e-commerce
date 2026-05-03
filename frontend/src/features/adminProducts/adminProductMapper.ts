import type { ProductCreateFormValues } from "./adminProductFormTypes";
import type { ProductCreateRequest, ProductResponse, ProductUpdateRequest } from "./adminProductTypes";

export function toProductCreateRequest(
    values: ProductCreateFormValues
): ProductCreateRequest {
    return {
        name: values.name.trim(),
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        brandId: Number(values.brandId),
        categoryId: Number(values.categoryId),
        active: true,
        variants: [
            {
                variantName: values.variantName.trim(),
                stockQuantity: Number(values.stockQuantity),
                price: Number(values.price),
                salePrice: Number(values.salePrice),
                currency: "VND",
            },
        ],
        media: values.mediaUrls
            .map((url) => url.trim())
            .filter(Boolean)
            .map((url, index) => ({
                url,
                mediaType: "image",
                thumbnail: index === 0,
                sortOrder: index,
                altText: values.name.trim(),
            })),
    };
}

export function toProductUpdateRequest(
    values: ProductCreateFormValues,
    active: boolean
): ProductUpdateRequest {
    return {
        name: values.name.trim(),
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        brandId: Number(values.brandId),
        categoryId: Number(values.categoryId),
        active,
    };
}

export function toProductFormValues(product: ProductResponse): ProductCreateFormValues {
    const primaryVariant = product.variants.find((variant) => variant.active) ?? product.variants[0];
    const mediaUrls = product.media
        .filter((media) => media.active)
        .sort((first, second) => first.sortOrder - second.sortOrder)
        .map((media) => media.url);

    return {
        name: product.name ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        brandId: product.brand?.id ? String(product.brand.id) : "",
        categoryId: product.category?.id ? String(product.category.id) : "",
        variantName: primaryVariant?.variantName ?? "Default",
        price: primaryVariant?.price != null ? String(primaryVariant.price) : "",
        salePrice: primaryVariant?.salePrice != null ? String(primaryVariant.salePrice) : "",
        stockQuantity: primaryVariant?.stockQuantity != null ? String(primaryVariant.stockQuantity) : "",
        imageUrl: mediaUrls[0] ?? "",
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : [""],
    };
}
