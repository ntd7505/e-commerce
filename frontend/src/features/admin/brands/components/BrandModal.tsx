import { X } from "lucide-react";
import { AdminImage } from "../../../../components/admin/AdminImage";
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
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-xl">
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
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-surface-alt">
                            <AdminImage
                                src={logoUrl}
                                alt="Brand logo preview"
                                fallbackLabel={brandName}
                                className="max-h-full max-w-full object-contain"
                                fallbackClassName="h-full w-full rounded-full"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Enter logo URL"
                            value={logoUrl}
                            onChange={(event) => onLogoChange(event.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface-alt px-4 py-3 text-sm font-medium text-text focus:border-success focus:outline-none"
                        />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border bg-surface px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-2xl border border-border bg-surface px-5 py-2.5 text-sm font-bold text-muted transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
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
