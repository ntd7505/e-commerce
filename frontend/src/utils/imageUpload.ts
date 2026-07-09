type CloudinaryUploadResponse = {
    secure_url?: string;
    url?: string;
    public_id?: string;
    error?: {
        message?: string;
    };
};

export type UploadOptions = {
    maxSizeMB?: number;
    maxDimension?: number;
    folder?: string;
};

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_DIMENSION = 1600;
const UPLOAD_IMAGE_QUALITY = 0.82;

export function validateImageFile(file: File, maxSizeMB: number = 15): string | null {
    if (!file.type.startsWith("image/")) {
        return "Vui lòng chỉ chọn file ảnh hợp lệ";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        return `Kích thước ảnh tối đa là ${maxSizeMB}MB`;
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

export async function optimizeImageFile(file: File, maxDimension: number): Promise<File> {
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(
            1,
            maxDimension / bitmap.width,
            maxDimension / bitmap.height
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
        console.warn("Failed to optimize image before upload:", error);
        return file;
    }
}

function getCloudinaryConfig(customFolder?: string) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
    const folder = customFolder || import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || "ecommerce/general";

    if (!cloudName || !uploadPreset) {
        throw new Error("Thiếu cấu hình Cloudinary: VITE_CLOUDINARY_CLOUD_NAME hoặc VITE_CLOUDINARY_UPLOAD_PRESET");
    }

    return { cloudName, uploadPreset, folder };
}

export async function uploadImage(file: File, options?: UploadOptions): Promise<string> {
    const maxSizeMB = options?.maxSizeMB || DEFAULT_MAX_SIZE_MB;
    const maxDimension = options?.maxDimension || DEFAULT_MAX_DIMENSION;
    
    const validationError = validateImageFile(file, 15); // always check source file < 15MB

    if (validationError) {
        throw new Error(validationError);
    }

    const uploadFile = await optimizeImageFile(file, maxDimension);

    if (uploadFile.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Ảnh vẫn lớn hơn ${maxSizeMB}MB sau khi nén`);
    }

    const { cloudName, uploadPreset, folder } = getCloudinaryConfig(options?.folder);

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
        throw new Error(data.error?.message ?? "Tải ảnh lên Cloudinary thất bại");
    }

    const imageUrl = data.secure_url ?? data.url;

    if (!imageUrl) {
        throw new Error("Cloudinary không trả về URL ảnh");
    }

    return imageUrl;
}
