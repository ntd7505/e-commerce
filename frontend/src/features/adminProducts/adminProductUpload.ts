type CloudinaryUploadResponse = {
    secure_url: string;
};

const MAX_SOURCE_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_DIMENSION = 1600;
const UPLOAD_IMAGE_QUALITY = 0.82;

export function validateProductImageFile(file: File): string | null {
    if (!file.type.startsWith("image/")) {
        return "Please choose image files only";
    }

    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
        return "Each image must be 15MB or smaller";
    }

    return null;
}

function getOptimizedImageName(fileName: string) {
    const extensionIndex = fileName.lastIndexOf(".");

    if (extensionIndex === -1) {
        return `${fileName}.webp`;
    }

    return `${fileName.slice(0, extensionIndex)}.webp`;
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", UPLOAD_IMAGE_QUALITY);
    });
}

async function optimizeProductImageFile(file: File): Promise<File> {
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(
            1,
            MAX_UPLOAD_IMAGE_DIMENSION / bitmap.width,
            MAX_UPLOAD_IMAGE_DIMENSION / bitmap.height
        );
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
            bitmap.close();
            return file;
        }

        context.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await canvasToBlob(canvas);

        if (!blob || blob.size >= file.size) {
            return file;
        }

        return new File([blob], getOptimizedImageName(file.name), {
            type: blob.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.warn("Failed to optimize product image before upload:", error);
        return file;
    }
}

export async function uploadProductImage(file: File): Promise<string> {
    const validationError = validateProductImageFile(file);

    if (validationError) {
        throw new Error(validationError);
    }

    const uploadFile = await optimizeProductImageFile(file);

    if (uploadFile.size > MAX_UPLOAD_IMAGE_SIZE) {
        throw new Error("Image is still larger than 5MB after optimization");
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Missing Cloudinary upload configuration");
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "ecommerce/products");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const data = await response.json() as CloudinaryUploadResponse;
    return data.secure_url;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(uploadProductImage));
}
