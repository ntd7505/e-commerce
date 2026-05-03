import { Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import type { ProductCreateFormValues } from "../adminProductFormTypes";

type ProductCreateImagesPanelProps = {
    formValues: ProductCreateFormValues;
    uploadingKey: string | null;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUrlChange: (index: number, value: string) => void;
    onUpload: (index: number, file?: File) => void;
};

export function ProductCreateImagesPanel({
    formValues,
    uploadingKey,
    onAdd,
    onRemove,
    onUrlChange,
    onUpload,
}: ProductCreateImagesPanelProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Product Images</h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 shadow-sm hover:bg-gray-50"
                >
                    <PlusCircle className="h-3.5 w-3.5" /> Add image
                </button>
            </div>

            <div className="mb-5 flex aspect-video items-center justify-center rounded-xl border border-gray-200 bg-[#f8f9fa] p-6">
                {formValues.mediaUrls[0]?.trim() ? (
                    <img
                        src={formValues.mediaUrls[0]}
                        alt="Product thumbnail preview"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
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
                            placeholder="https://example.com/image.jpg"
                            className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-2.5 text-[12px] focus:border-emerald-500 focus:outline-none"
                        />
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-bold text-gray-600 hover:bg-gray-50">
                            <Upload className="h-4 w-4" />
                            {uploadingKey === `create-${index}` ? "Uploading..." : "Upload"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingKey !== null}
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
                            className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
