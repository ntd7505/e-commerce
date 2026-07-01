import { AlertTriangle, Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import { AdminImage } from "../../../../components/admin/AdminImage";
import type { MediaDraft } from "../adminProductFormTypes";

const DUMMY_DOMAINS = ["example.com", "placeholder.com"];

function hasDummyUrl(url: string) {
    return DUMMY_DOMAINS.some((domain) => url.includes(domain));
}

type ProductMediaEditorProps = {
    mediaItems: MediaDraft[];
    uploadingKey: string | null;
    savingMediaIndex: number | null;
    onAdd: () => void;
    onSave: (index: number) => void;
    onDelete: (index: number) => void;
    onUpload: (index: number, file?: File) => void;
    onUploadMany: (files?: FileList | null) => void;
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
    onUploadMany,
    onChange,
}: ProductMediaEditorProps) {
    const isUploading = uploadingKey !== null;

    return (
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-text">Product Media</h3>
                <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted shadow-sm hover:bg-surface">
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingKey === "edit-bulk" ? "Uploading..." : "Upload images"}
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
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted shadow-sm hover:bg-surface disabled:opacity-50"
                    >
                        <PlusCircle className="h-3.5 w-3.5" /> Add URL
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {mediaItems.map((media, index) => (
                    <div key={media.id ?? `new-${index}`} className="rounded-lg border border-border-strong p-4">
                        <div className="mb-3 flex aspect-video items-center justify-center rounded-lg border border-border-strong bg-surface-alt p-4">
                            {media.url ? (
                                <AdminImage
                                    src={media.url}
                                    alt={media.altText || "Product media"}
                                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    fallbackClassName="h-full w-full"
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-muted" />
                            )}
                        </div>
                        <input
                            value={media.url}
                            onChange={(event) => onChange(index, { url: event.target.value })}
                            placeholder="Image URL"
                            className="mb-1 w-full rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-xs focus:border-success focus:outline-none"
                        />
                        {hasDummyUrl(media.url) && (
                            <p className="mb-3 flex items-center gap-1 text-xs font-bold text-warning">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                URL chứa example.com — upload ảnh thật để thay thế
                            </p>
                        )}
                        {!hasDummyUrl(media.url) && <div className="mb-3" />}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                value={media.altText}
                                onChange={(event) => onChange(index, { altText: event.target.value })}
                                placeholder="Alt text"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-xs focus:border-success focus:outline-none"
                            />
                            <input
                                type="number"
                                value={media.sortOrder}
                                onChange={(event) => onChange(index, { sortOrder: event.target.value })}
                                placeholder="Sort"
                                className="rounded-lg border border-border-strong bg-surface-alt px-3 py-2.5 text-xs focus:border-success focus:outline-none"
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-text">
                                    <input
                                        type="checkbox"
                                        checked={media.thumbnail}
                                        onChange={(event) => onChange(index, { thumbnail: event.target.checked })}
                                        className="h-4 w-4 accent-emerald-500"
                                    />
                                    Thumbnail
                                </label>
                                <label className="flex items-center gap-2 text-xs font-bold text-text">
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
                                <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted hover:bg-surface">
                                    <Upload className="h-4 w-4" />
                                    {uploadingKey === `edit-${index}` ? "Uploading..." : "Upload"}
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
                                    onClick={() => onSave(index)}
                                    disabled={savingMediaIndex === index}
                                    className="rounded-lg bg-success px-3 py-2 text-xs font-bold text-white hover:bg-success disabled:opacity-50"
                                >
                                    {savingMediaIndex === index ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="rounded-xl border border-border bg-surface p-2 text-muted hover:bg-danger-soft hover:text-danger"
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
