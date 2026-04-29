import type { ProductCreateRequest } from "./adminProductTypes";

export type ProductCreateFormValues = {
    name: string;
    shortDescription: string;
    description: string;
    brandId: string;
    categoryId: string;
    variantName: string;
    price: string;
    salePrice: string;
    stockQuantity: string;
    imageUrl: string;
};

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
        media: values.imageUrl
            ? [
                {
                    url: values.imageUrl.trim(),
                    mediaType: "image",
                    thumbnail: true,
                    sortOrder: 0,
                    altText: values.name.trim(),
                },
            ]
            : [],
    };
}
