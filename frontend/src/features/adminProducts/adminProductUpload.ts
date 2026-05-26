type CloudinaryUploadResponse = {
    secure_url?: string;
    url?: string;
    public_id?: string;
    error?: {
        message?: string;
    };
};

const MAX_SOURCE_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_DIMENSION = 1600;
const UPLOAD_IMAGE_QUALITY = 0.82;
const DEFAULT_CLOUDINARY_FOLDER = "ecommerce/products";

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

function getCloudinaryConfig() {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || DEFAULT_CLOUDINARY_FOLDER;

    if (!cloudName || !uploadPreset) {
        throw new Error("Missing Cloudinary config: VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET");
    }

    return { cloudName, uploadPreset, folder };
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

    const { cloudName, uploadPreset, folder } = getCloudinaryConfig();

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });
    const data = await response.json() as CloudinaryUploadResponse;

    if (!response.ok) {
        throw new Error(data.error?.message ?? "Cloudinary upload failed");
    }

    const imageUrl = data.secure_url ?? data.url;

    if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL");
    }

    return imageUrl;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(uploadProductImage));
}
