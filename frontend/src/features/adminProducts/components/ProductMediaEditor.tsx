import { Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import type { MediaDraft } from "../adminProductFormTypes";

type ProductMediaEditorProps = {
    mediaItems: MediaDraft[];
    uploadingKey: string | null;
    savingMediaIndex: number | null;
    onAdd: () => void;
    onSave: (index: number) => void;
    onDelete: (index: number) => void;
    onUpload: (index: number, file?: File) => void;
    onChange: (index: number, patch: Partial<MediaDraft>) => void;
};

export function ProductMediaEditor({
    mediaItems,
    uploadingKey,
    savingMediaIndex,
    onAdd,
    onSave,
    onDelete,
    onUpload,
    onChange,
}: ProductMediaEditorProps) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Product Media</h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 shadow-sm hover:bg-gray-50"
                >
                    <PlusCircle className="h-3.5 w-3.5" /> Add media
                </button>
            </div>

            <div className="space-y-4">
                {mediaItems.map((media, index) => (
                    <div key={media.id ?? `new-${index}`} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-3 flex aspect-video items-center justify-center rounded-lg border border-gray-200 bg-[#f8f9fa] p-4">
                            {media.url ? (
                                <img
                                    src={media.url}
                                    alt={media.altText || "Product media"}
                                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        <input
                            value={media.url}
                            onChange={(event) => onChange(index, { url: event.target.value })}
                            placeholder="Image URL"
                            className="mb-3 w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-3 py-2.5 text-[12px] focus:border-emerald-500 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                value={media.altText}
                                onChange={(event) => onChange(index, { altText: event.target.value })}
                                placeholder="Alt text"
                                className="rounded-lg border border-gray-200 bg-[#f8f9fa] px-3 py-2.5 text-[12px] focus:border-emerald-500 focus:outline-none"
                            />
                            <input
                                type="number"
                                value={media.sortOrder}
                                onChange={(event) => onChange(index, { sortOrder: event.target.value })}
                                placeholder="Sort"
                                className="rounded-lg border border-gray-200 bg-[#f8f9fa] px-3 py-2.5 text-[12px] focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={media.thumbnail}
                                        onChange={(event) => onChange(index, { thumbnail: event.target.checked })}
                                        className="h-4 w-4 accent-emerald-500"
                                    />
                                    Thumbnail
                                </label>
                                <label className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={media.active}
                                        onChange={(event) => onChange(index, { active: event.target.checked })}
                                        className="h-4 w-4 accent-emerald-500"
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 hover:bg-gray-50">
                                    <Upload className="h-4 w-4" />
                                    {uploadingKey === `edit-${index}` ? "Uploading..." : "Upload"}
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
                                    onClick={() => onSave(index)}
                                    disabled={savingMediaIndex === index}
                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-[12px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {savingMediaIndex === index ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
