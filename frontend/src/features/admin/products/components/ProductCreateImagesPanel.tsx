import { AlertTriangle, Image as ImageIcon, PlusCircle, Trash2, Upload } from "lucide-react";
import { Button } from "../../../../components/common";
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
        <section className="rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-alt px-6 py-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-text">Hình ảnh sản phẩm</h3>
                <div className="flex items-center gap-2">
                    <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-all hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="h-4 w-4" />
                        {uploadingKey === "create-bulk" ? "Đang tải..." : "Tải nhiều ảnh lên"}
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

            <div className="p-6">
                <div className="mb-5 flex aspect-video items-center justify-center rounded-xl border border-border-strong bg-surface-alt p-6">
                {formValues.mediaUrls[0]?.trim() ? (
                    <AdminImage
                        src={formValues.mediaUrls[0]}
                        alt="Product thumbnail preview"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        fallbackClassName="h-full w-full"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted">
                        <ImageIcon className="h-10 w-10" />
                        <span className="text-xs">Chưa có ảnh đại diện</span>
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
                                placeholder="Nhập URL ảnh hoặc tải lên"
                                className="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {(url.includes("example.com") || url.includes("placeholder.com")) && (
                                <span className="text-xs font-bold text-warning" title="Cần upload ảnh thật">
                                    <AlertTriangle className="inline h-3.5 w-3.5" /> Ảnh mẫu
                                </span>
                            )}
                            <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text transition-all hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <Upload className="h-4 w-4" />
                                {uploadingKey === `create-${index}` ? "Đang tải..." : "Tải lên"}
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
                                variant="danger"
                                onClick={() => onRemove(index)}
                                disabled={formValues.mediaUrls.length === 1 && !url.trim()}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
