import { AlertTriangle, Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import { AdminImage } from "../../../../components/admin/AdminImage";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductCreateImagesPanelProps = {
    formValues: ProductCreateFormValues;
    uploadingKey: string | null;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUrlChange: (index: number, value: string) => void;
    onUpload: (index: number, file?: File) => void;
    onUploadMany: (files?: FileList | null) => void;
};

export function ProductCreateImagesPanel({
    formValues,
    uploadingKey,
    onAdd,
    onRemove,
    onUrlChange,
    onUpload,
    onUploadMany,
}: ProductCreateImagesPanelProps) {
    const isUploading = uploadingKey !== null;

    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Product Images</h3>
                <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingKey === "create-bulk" ? "Uploading..." : "Upload images"}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={isUploading}
                            onChange={(event) => {
                                onUploadMany(event.target.files);
                                event.target.value = "";
                            }}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={onAdd}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        <PlusCircle className="h-3.5 w-3.5" /> Add URL
                    </button>
                </div>
            </div>

            <div className="mb-5 flex aspect-video items-center justify-center rounded-xl border border-slate-200 bg-[#f8f9fa] p-6">
                {formValues.mediaUrls[0]?.trim() ? (
                    <AdminImage
                        src={formValues.mediaUrls[0]}
                        alt="Product thumbnail preview"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        fallbackClassName="h-full w-full"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImageIcon className="h-10 w-10" />
                        <span className="text-[12px]">No thumbnail selected</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {formValues.mediaUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={url}
                            onChange={(event) => onUrlChange(index, event.target.value)}
                            placeholder="Enter image URL or upload"
                            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-[#f8f9fa] px-4 py-2.5 text-[12px] focus:border-emerald-500 focus:outline-none"
                        />
                        {(url.includes("example.com") || url.includes("placeholder.com")) && (
                            <span className="text-[11px] font-bold text-amber-600" title="Cần upload ảnh thật">
                                <AlertTriangle className="inline h-3.5 w-3.5" /> Ảnh mẫu
                            </span>
                        )}
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-3 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50">
                            <Upload className="h-4 w-4" />
                            {uploadingKey === `create-${index}` ? "Uploading..." : "Upload"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading}
                                onChange={(event) => {
                                    onUpload(index, event.target.files?.[0]);
                                    event.target.value = "";
                                }}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            disabled={formValues.mediaUrls.length === 1 && !url.trim()}
                            className="rounded-2xl border border-slate-100 bg-white p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
