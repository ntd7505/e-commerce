import { Image as ImageIcon, X } from "lucide-react";
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
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                    <h3 className="text-[16px] font-bold text-gray-900">
                        {editingBrand ? "Edit Brand" : "Add Brand"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Apple"
                            value={brandName}
                            onChange={(event) => onNameChange(event.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">Logo URL</label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-[#f8f9fa]">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Brand logo preview" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="https://example.com/logo.png"
                                value={logoUrl}
                                onChange={(event) => onLogoChange(event.target.value)}
                                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    >
                        {saving ? "Saving..." : "Save Brand"}
                    </button>
                </div>
            </div>
        </div>
    );
}
