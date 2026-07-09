import { uploadImage, validateImageFile } from "../../../utils/imageUpload";

export function validateProductImageFile(file: File): string | null {
    return validateImageFile(file, 15) ? "Please choose image files only and each must be 15MB or smaller" : null;
}

export async function uploadProductImage(file: File): Promise<string> {
    return uploadImage(file, { folder: "ecommerce/products", maxDimension: 1600 });
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(uploadProductImage));
}
