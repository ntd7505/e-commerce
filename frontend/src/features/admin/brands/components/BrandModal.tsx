import { X, Upload } from "lucide-react";
import { Button } from "../../../../components/common";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { uploadImage } from "../../../../utils/imageUpload";
import { useState } from "react";
import type { BrandResponse } from "../adminBrandTypes";

type BrandModalProps = {
    show: boolean;
    editingBrand: BrandResponse | null;
    brandName: string;
    logoUrl: string;
    saving: boolean;
    onNameChange: (value: string) => void;
    onLogoChange: (value: string) => void;
    onClose: () => void;
    onSave: () => void;
};

export function BrandModal({
    show,
    editingBrand,
    brandName,
    logoUrl,
    saving,
    onNameChange,
    onLogoChange,
    onClose,
    onSave,
}: BrandModalProps) {
    const [uploading, setUploading] = useState(false);

    if (!show) {
        return null;
    }

    async function handleUpload(file: File) {
        try {
            setUploading(true);
            const url = await uploadImage(file, { folder: "ecommerce/brands", maxDimension: 800 });
            onLogoChange(url);
        } catch (error) {
            console.error("Failed to upload brand logo:", error);
            alert("Không thể tải ảnh lên. Vui lòng thử lại.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl animate-fade-in-up">
                <div className="flex items-center justify-between border-b border-border bg-surface-alt px-6 py-4">
                    <h3 className="text-base font-bold text-text">
                        {editingBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">
                            Tên thương hiệu <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Apple"
                            value={brandName}
                            onChange={(event) => onNameChange(event.target.value)}
                            className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">URL Hình ảnh</label>
                        <div className="flex items-center gap-4">
                            <div className="relative group flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface-alt">
                                <AdminImage
                                    src={logoUrl}
                                    alt="Brand logo preview"
                                    fallbackLabel={brandName}
                                    className="max-h-full max-w-full object-contain"
                                    fallbackClassName="h-full w-full rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-2 text-white">
                                        <Upload className="mb-1 h-5 w-5" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) void handleUpload(file);
                                                e.target.value = "";
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập URL hoặc tải ảnh lên"
                                        value={logoUrl}
                                        onChange={(event) => onLogoChange(event.target.value)}
                                        className="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        disabled={uploading}
                                    />
                                    <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-bold transition-colors hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20 ${uploading ? 'opacity-60 pointer-events-none' : 'text-text'}`}>
                                        <Upload className="h-4 w-4" />
                                        {uploading ? "Đang tải..." : "Tải lên"}
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) void handleUpload(file);
                                                e.target.value = "";
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border bg-surface px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSave}
                        disabled={saving}
                        loading={saving}
                    >
                        Lưu thương hiệu
                    </Button>
                </div>
            </div>
        </div>
    );
}

