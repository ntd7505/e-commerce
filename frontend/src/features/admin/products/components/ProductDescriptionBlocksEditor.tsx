import { useState, type MouseEvent } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, Image as ImageIcon, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../components/common/Button";
import { Badge } from "../../../../components/common/Badge";
import { updateProductDescriptionBlocks } from "../adminProductApi";
import type {
  ProductDescriptionBlockRequest,
  ProductDescriptionBlockResponse,
  ProductDescriptionBlockType,
} from "../adminProductTypes";
import { uploadProductImage } from "../adminProductUpload";
import { useToast } from "../../../../features/ui/ToastProvider";

interface ProductDescriptionBlocksEditorProps {
  productId: number;
  initialBlocks: ProductDescriptionBlockResponse[];
  onReload: () => Promise<void>;
}

export function ProductDescriptionBlocksEditor({ productId, initialBlocks, onReload }: ProductDescriptionBlocksEditorProps) {
  const { showToast } = useToast();
  const [blocks, setBlocks] = useState<Partial<ProductDescriptionBlockResponse>[]>(
    [...initialBlocks].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [saving, setSaving] = useState(false);
  const [savedMoment, setSavedMoment] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]));

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleAddBlock = () => {
    setBlocks((prev) => {
      const next = [
        ...prev,
        {
          type: "TEXT" as ProductDescriptionBlockType,
          sortOrder: prev.length,
          active: true,
          title: "",
          content: "",
          imageUrl: "",
          altText: "",
        },
      ];
      setExpandedIndexes((prevExpanded) => new Set([...prevExpanded, next.length - 1]));
      return next;
    });
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value < index) next.add(value);
        if (value > index) next.add(value - 1);
      });
      return next;
    });
  };

  const handleChange = (index: number, field: keyof ProductDescriptionBlockResponse, value: unknown) => {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)));
  };

  const handleMove = (index: number, direction: -1 | 1, event: MouseEvent) => {
    event.stopPropagation();
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;

    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

    setExpandedIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value === index) next.add(target);
        else if (value === target) next.add(index);
        else next.add(value);
      });
      return next;
    });
  };

  const handleImageUpload = async (index: number, file?: File) => {
    if (!file) return;

    try {
      setUploadingIndex(index);
      const url = await uploadProductImage(file);
      handleChange(index, "imageUrl", url);
    } catch (error) {
      console.error("Failed to upload description image:", error);
      showToast("Lỗi khi tải ảnh lên. Vui lòng thử lại.", "error");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    for (let i = 0; i < blocks.length; i += 1) {
      const block = blocks[i];
      const title = block.title?.trim();
      const content = block.content?.trim();
      const imageUrl = block.imageUrl?.trim();

      if (!block.type) {
        showToast(`Khối nội dung ở dòng ${i + 1} thiếu loại.`, "error");
        return;
      }
      if (block.type === "TEXT" && !title && !content) {
        showToast(`Khối văn bản ở dòng ${i + 1} cần có tiêu đề hoặc nội dung.`, "error");
        return;
      }
      if (block.type === "IMAGE" && !imageUrl) {
        showToast(`Khối hình ảnh ở dòng ${i + 1} cần có URL hình ảnh.`, "error");
        return;
      }
      if (block.type === "TEXT_IMAGE" && (!imageUrl || (!title && !content))) {
        showToast(`Khối văn bản + ảnh ở dòng ${i + 1} cần có hình ảnh và văn bản.`, "error");
        return;
      }
    }

    try {
      setSaving(true);
      const payload: ProductDescriptionBlockRequest[] = blocks.map((block, index) => ({
        type: block.type as ProductDescriptionBlockType,
        title: block.title?.trim() || null,
        content: block.content?.trim() || null,
        imageUrl: block.imageUrl?.trim() || null,
        altText: block.altText?.trim() || null,
        sortOrder: index,
        active: block.active ?? true,
      }));

      await updateProductDescriptionBlocks(productId, { blocks: payload });
      setSavedMoment(true);
      setTimeout(() => setSavedMoment(false), 1800);
      await onReload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 403) {
        showToast("Bạn không có quyền cập nhật sản phẩm hoặc phiên đăng nhập admin đã hết hạn.", "error");
      } else {
        showToast("Lỗi khi lưu mô tả chi tiết.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const getPreviewText = (block: Partial<ProductDescriptionBlockResponse>) => {
    if (block.title) return block.title;
    if (block.content) return block.content.substring(0, 60) + (block.content.length > 60 ? "..." : "");
    if (block.imageUrl) return block.imageUrl.substring(block.imageUrl.lastIndexOf("/") + 1) || "Hình ảnh";
    return "Chưa có nội dung";
  };

  const getTypeVariant = (type?: string): "primary" | "success" | "warning" | "neutral" => {
    switch (type) {
      case "TEXT": return "primary";
      case "IMAGE": return "success";
      case "TEXT_IMAGE": return "warning";
      default: return "neutral";
    }
  };

  const getTypeName = (type?: string) => {
    switch (type) {
      case "TEXT": return "Văn bản";
      case "IMAGE": return "Hình ảnh";
      case "TEXT_IMAGE": return "Văn bản + ảnh";
      default: return "Trống";
    }
  };

  const visibleCount = blocks.filter((block) => block.active).length;

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-canvas px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-text">Mô tả chi tiết</h2>
          <Badge variant="neutral">
            {blocks.length} blocks · {visibleCount} hiện
          </Badge>
        </div>
        <Button
          variant={savedMoment ? "success" : "primary"}
          onClick={handleSave}
          loading={saving || uploadingIndex !== null}
          leftIcon={savedMoment ? <Check className="h-4 w-4" /> : undefined}
        >
          {savedMoment ? "Đã lưu" : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="space-y-4 p-6">
        {blocks.map((block, index) => {
          const isExpanded = expandedIndexes.has(index);

          return (
            <div key={index} className="overflow-hidden rounded-xl border border-border bg-canvas">
              <div
                className={`flex cursor-pointer select-none items-center justify-between p-3 transition-colors hover:bg-surface ${isExpanded ? "border-b border-border bg-surface" : ""}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={(event) => handleMove(index, -1, event)} disabled={index === 0} className="p-1 text-muted transition-colors hover:text-primary disabled:opacity-30" title="Di chuyển lên">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={(event) => handleMove(index, 1, event)} disabled={index === blocks.length - 1} className="p-1 text-muted transition-colors hover:text-primary disabled:opacity-30" title="Di chuyển xuống">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="w-7 text-sm font-bold text-text">#{index + 1}</span>
                  <Badge variant={getTypeVariant(block.type)}>{getTypeName(block.type)}</Badge>
                  <Badge variant={block.active ? "success" : "neutral"}>{block.active ? "Hiện" : "Ẩn"}</Badge>
                  <span className="hidden max-w-md truncate border-l border-border pl-4 text-sm text-text-muted sm:block">
                    {getPreviewText(block)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveBlock(index);
                    }}
                    className="rounded-lg p-2 text-danger transition-colors hover:bg-danger/10"
                    title="Xóa khối nội dung"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronDown className={`h-5 w-5 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="flex flex-col gap-6 bg-canvas p-4 xl:flex-row">
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label htmlFor={`block-type-${index}`} className="mb-1 block text-sm font-medium text-text">Loại nội dung</label>
                        <select id={`block-type-${index}`} value={block.type || "TEXT"} onChange={(e) => handleChange(index, "type", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                          <option value="TEXT">Văn bản</option>
                          <option value="IMAGE">Hình ảnh</option>
                          <option value="TEXT_IMAGE">Văn bản & hình ảnh</option>
                        </select>
                      </div>
                      <div className="w-28">
                        <label htmlFor={`block-active-${index}`} className="mb-1 block text-sm font-medium text-text">Trạng thái</label>
                        <select id={`block-active-${index}`} value={block.active ? "true" : "false"} onChange={(e) => handleChange(index, "active", e.target.value === "true")} className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                          <option value="true">Hiện</option>
                          <option value="false">Ẩn</option>
                        </select>
                      </div>
                    </div>

                    {(block.type === "TEXT" || block.type === "TEXT_IMAGE") && (
                      <>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-text">Tiêu đề</label>
                          <input value={block.title || ""} onChange={(e) => handleChange(index, "title", e.target.value)} placeholder="Ví dụ: Trải nghiệm âm thanh vượt trội" className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-text">Nội dung</label>
                          <textarea value={block.content || ""} onChange={(e) => handleChange(index, "content", e.target.value)} rows={5} placeholder="Nhập nội dung mô tả chi tiết..." className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                        </div>
                      </>
                    )}

                    {(block.type === "IMAGE" || block.type === "TEXT_IMAGE") && (
                      <>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-text">URL hình ảnh</label>
                          <div className="flex gap-2">
                            <input value={block.imageUrl || ""} onChange={(e) => handleChange(index, "imageUrl", e.target.value)} placeholder="https://..." className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-semibold text-text hover:bg-surface-alt">
                              Upload
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => void handleImageUpload(index, e.target.files?.[0])} />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-text">Alt text</label>
                          <input value={block.altText || ""} onChange={(e) => handleChange(index, "altText", e.target.value)} placeholder="Mô tả ngắn cho ảnh" className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-full rounded-xl border border-dashed border-border bg-surface p-4 xl:w-80">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-text">
                      {block.type === "IMAGE" ? <ImageIcon className="h-4 w-4" /> : <LayoutTemplate className="h-4 w-4" />}
                      Preview
                    </div>
                    {block.imageUrl ? (
                      <img src={block.imageUrl} alt={block.altText || block.title || "Preview"} className="mb-3 h-36 w-full rounded-lg object-cover" />
                    ) : (
                      <div className="mb-3 flex h-36 items-center justify-center rounded-lg bg-surface-alt text-xs text-muted">Chưa có ảnh</div>
                    )}
                    <p className="font-bold text-text">{block.title || "Tiêu đề mô tả"}</p>
                    <p className="mt-2 line-clamp-4 text-sm text-muted">{block.content || "Nội dung mô tả sẽ hiển thị tại đây."}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-[var(--surface-alt)] px-4 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-canvas shadow-sm">
              <LayoutTemplate className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mb-1 text-base font-bold text-text">Chưa có mô tả chi tiết</h3>
            <p className="mb-5 max-w-sm text-sm text-text-muted">
              Thêm các khối văn bản hoặc hình ảnh để làm phong phú nội dung sản phẩm.
            </p>
          </div>
        )}

        <Button variant="ghost" leftIcon={<Plus className="h-5 w-5" />} onClick={handleAddBlock}>
          Thêm khối nội dung
        </Button>
      </div>
    </div>
  );
}
