import { AlertTriangle, Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import { Button } from "../../../../components/common";
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
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Hình ảnh sản phẩm</h3>
                <div className="flex items-center gap-2">
                    <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-all hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="h-4 w-4" />
                        {uploadingKey === "edit-bulk" ? "Đang tải..." : "Tải nhiều ảnh lên"}
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
                    <Button
                        variant="secondary"
                        onClick={onAdd}
                        disabled={isUploading}
                        leftIcon={<PlusCircle className="h-4 w-4" />}
                    >
                        Thêm URL
                    </Button>
                </div>
            </div>

            <div className="space-y-4 p-6">
                {mediaItems.map((media, index) => (
                    <div key={media.id ?? `new-${index}`} className="rounded-xl border border-border-strong bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-sm">
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
                            placeholder="URL hình ảnh"
                            className="mb-1 w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                                placeholder="Văn bản thay thế"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <input
                                type="number"
                                value={media.sortOrder}
                                onChange={(event) => onChange(index, { sortOrder: event.target.value })}
                                placeholder="Thứ tự"
                                className="rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-text transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={media.thumbnail}
                                        onChange={(event) => onChange(index, { thumbnail: event.target.checked })}
                                        className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/20"
                                    />
                                    Ảnh đại diện
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-text transition-colors hover:text-primary">
                                    <input
                                        type="checkbox"
                                        checked={media.active}
                                        onChange={(event) => onChange(index, { active: event.target.checked })}
                                        className="h-4 w-4 rounded border-border-strong text-primary focus:ring-primary/20"
                                    />
                                    Đang hiển thị
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-text transition-all hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Upload className="h-4 w-4" />
                                    {uploadingKey === `edit-${index}` ? "Đang tải..." : "Tải lên"}
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
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onSave(index)}
                                    disabled={savingMediaIndex === index}
                                    loading={savingMediaIndex === index}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
