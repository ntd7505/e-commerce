import { X, Upload } from "lucide-react";
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
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl">
                <div className="flex items-center justify-between border-b border-border bg-surface/50 px-6 py-4">
                    <h3 className="text-base font-bold text-text">
                        {editingBrand ? "Edit Brand" : "Add Brand"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">
                            Brand Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Apple"
                            value={brandName}
                            onChange={(event) => onNameChange(event.target.value)}
                            className="w-full rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-medium text-text focus:border-success focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-text">Logo URL</label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface-alt relative group">
                                <AdminImage
                                    src={logoUrl}
                                    alt="Brand logo preview"
                                    fallbackLabel={brandName}
                                    className="max-h-full max-w-full object-contain"
                                    fallbackClassName="h-full w-full rounded-full"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer text-white flex flex-col items-center justify-center p-2 h-full w-full">
                                        <Upload className="h-5 w-5 mb-1" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpload(file);
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
                                        placeholder="Enter logo URL or upload image"
                                        value={logoUrl}
                                        onChange={(event) => onLogoChange(event.target.value)}
                                        className="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-medium text-text focus:border-success focus:outline-none"
                                        disabled={uploading}
                                    />
                                    <label className={`cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold transition-colors hover:bg-surface-alt ${uploading ? 'opacity-60 pointer-events-none' : 'text-text'}`}>
                                        <Upload className="h-4 w-4" />
                                        {uploading ? "Uploading..." : "Upload"}
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            disabled={uploading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpload(file);
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
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-bold text-muted transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="rounded-lg bg-success px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-success disabled:cursor-not-allowed disabled:bg-success/60"
                    >
                        {saving ? "Saving..." : "Save Brand"}
                    </button>
                </div>
            </div>
        </div>
    );
}

