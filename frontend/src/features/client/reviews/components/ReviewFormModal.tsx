import { useEffect, useState } from "react";
import { Loader2, X, Star, Link2, Plus, Image as ImageIcon } from "lucide-react";
import type { CreateReviewRequest, ProductReviewMediaRequest, ReviewMediaType } from "../reviewTypes";
import { uploadImage, validateImageFile } from "../../../../utils/imageUpload";
import { useToast } from "../../../../features/ui/ToastProvider";
type ReviewFormModalProps = {
  open: boolean;
  productName: string;
  variantName: string;
  orderItemId: number | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateReviewRequest) => void;
};

const inputBase =
  "w-full rounded-xl border px-3.5 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:ring-2";

function fieldClass(hasError: boolean): string {
  return hasError
    ? `${inputBase} border-danger focus:ring-danger-soft`
    : `${inputBase} border-border-strong focus:border-primary focus:ring-primary-soft`;
}

export function ReviewFormModal({
  open,
  productName,
  variantName,
  orderItemId,
  submitting,
  onClose,
  onSubmit,
}: ReviewFormModalProps) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [media, setMedia] = useState<ProductReviewMediaRequest[]>([]);
  const [touched, setTouched] = useState(false);
  const [mediaUrlDraft, setMediaUrlDraft] = useState("");
  const [manualMediaType, setManualMediaType] = useState<ReviewMediaType>("IMAGE");
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string }[]>([]);

  const isUploading = uploadingFiles.length > 0;

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setContent("");
      setAnonymous(false);
      setMedia([]);
      setTouched(false);
      setMediaUrlDraft("");
      setManualMediaType("IMAGE");
      setUploadingFiles([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, submitting, onClose]);

  if (!open || orderItemId === null) return null;

  const ratingError = touched && rating === 0;
  const titleError = touched && title.length > 150;
  const contentError = touched && content.length > 2000;
  const mediaCountError = media.length > 5;

  function addMedia() {
    const url = mediaUrlDraft.trim();
    if (!url || url.length > 500 || media.length >= 5) return;
    setMedia((prev) => [
      ...prev,
      { url, mediaType: manualMediaType, sortOrder: prev.length },
    ]);
    setMediaUrlDraft("");
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    e.target.value = ''; // Clear input

    if (media.length + files.length + uploadingFiles.length > 5) {
      showToast("Chỉ có thể tải lên tối đa 5 media tổng cộng", "error");
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateImageFile(file, 5); // 5MB
      if (error) {
        showToast(`Ảnh ${file.name} không hợp lệ: ${error}`, "error");
      } else {
        validFiles.push(file);
      }
    }
    
    if (!validFiles.length) return;

    const newUploading = validFiles.map(() => ({ id: Math.random().toString(36).substring(7) }));
    setUploadingFiles(prev => [...prev, ...newUploading]);

    await Promise.all(
      validFiles.map(async (file, index) => {
        const uploadId = newUploading[index].id;
        try {
          const url = await uploadImage(file, { folder: "ecommerce/reviews", maxDimension: 1600 });
          setMedia(prev => {
            if (prev.length >= 5) return prev; // Max 5 media
            return [...prev, { url, mediaType: "IMAGE", sortOrder: prev.length }];
          });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          showToast(`Tải lên ảnh ${file.name} thất bại: ${err?.message || "Lỗi không xác định"}`, "error");
        } finally {
          setUploadingFiles(prev => prev.filter(item => item.id !== uploadId));
        }
      })
    );
  };

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, sortOrder: i })));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (orderItemId === null) return;
    setTouched(true);
    if (rating === 0 || title.length > 150 || content.length > 2000 || media.length > 5) return;
    onSubmit({
      orderItemId,
      rating,
      title: title.trim() || null,
      content: content.trim() || null,
      anonymous,
      media,
    });
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-surface rounded-2xl border border-border overflow-hidden flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-text">Viết đánh giá</h3>
            <p className="mt-0.5 text-sm text-muted truncate">
              {productName} · {variantName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-muted hover:text-muted p-1 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
          {/* Rating */}
          <div className="mb-5">
            <span className="block text-sm font-semibold text-text mb-2">
              Đánh giá sao <span className="text-danger">*</span>
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, idx) => {
                const val = idx + 1;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={submitting}
                    className="p-1 disabled:opacity-50"
                    aria-label={`${val} sao`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        val <= displayRating
                          ? "fill-warning text-warning"
                          : "fill-transparent text-subtle hover:text-warning"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-text">{rating}/5</span>
              )}
            </div>
            {ratingError && (
              <p className="mt-1.5 text-xs text-danger font-medium">Vui lòng chọn số sao đánh giá.</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="rev-title" className="block text-sm font-semibold text-text mb-1.5">
              Tiêu đề
            </label>
            <input
              id="rev-title"
              type="text"
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              placeholder="Tóm tắt trải nghiệm của bạn..."
              className={fieldClass(!!titleError)}
            />
            {titleError && (
              <p className="mt-1.5 text-xs text-danger font-medium">Tiêu đề không vượt quá 150 ký tự.</p>
            )}
            <p className="mt-1 text-right text-xs text-muted">{title.length}/150</p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label htmlFor="rev-content" className="block text-sm font-semibold text-text mb-1.5">
              Nội dung
            </label>
            <textarea
              id="rev-content"
              rows={4}
              maxLength={2000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              placeholder="Chia sẻ chi tiết về sản phẩm..."
              className={`${fieldClass(!!contentError)} resize-none`}
            />
            {contentError && (
              <p className="mt-1.5 text-xs text-danger font-medium">Nội dung không vượt quá 2000 ký tự.</p>
            )}
            <p className="mt-1 text-right text-xs text-muted">{content.length}/2000</p>
          </div>

          {/* Media URLs */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-sm font-semibold text-text">
                Hình ảnh / Video (tùy chọn, tối đa 5)
              </span>
              <span className="text-xs text-muted">{media.length}/5 media</span>
            </div>
            
            {/* Thêm từ máy */}
            <div className="mb-3">
              <label 
                className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                  submitting || isUploading || media.length >= 5 
                    ? "border-border bg-surface-alt opacity-60 cursor-not-allowed" 
                    : "border-border-strong bg-surface hover:border-primary hover:bg-primary-soft"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={submitting || isUploading || media.length >= 5}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm font-medium text-primary">Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 text-muted" />
                    <span className="text-sm font-medium text-text">Nhấn để chọn ảnh từ máy (Tối đa 5MB/ảnh)</span>
                  </>
                )}
              </label>
            </div>

            {/* Hoặc URL thủ công */}
            <div className="flex items-center gap-2">
              <select
                value={manualMediaType}
                onChange={(e) => setManualMediaType(e.target.value as ReviewMediaType)}
                disabled={submitting || isUploading || media.length >= 5}
                className={`${inputBase} w-28 shrink-0`}
              >
                <option value="IMAGE">Ảnh</option>
                <option value="VIDEO">Video</option>
              </select>
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={mediaUrlDraft}
                  onChange={(e) => setMediaUrlDraft(e.target.value)}
                  disabled={submitting || isUploading || media.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMedia();
                    }
                  }}
                  placeholder="Hoặc dán URL media..."
                  className={`${fieldClass(false)} pl-9`}
                />
              </div>
              <button
                type="button"
                onClick={addMedia}
                disabled={submitting || isUploading || !mediaUrlDraft.trim() || media.length >= 5}
                className="inline-flex items-center gap-1 rounded-xl border border-border-strong bg-surface px-3 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>
            
            {mediaCountError && (
              <p className="mt-1.5 text-xs text-danger font-medium">Tối đa 5 media.</p>
            )}

            {/* Hiển thị danh sách media đã chọn */}
            {(media.length > 0 || uploadingFiles.length > 0) && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {media.map((m, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg border border-border bg-surface-alt overflow-hidden flex items-center justify-center">
                    {m.mediaType === 'IMAGE' ? (
                      <img src={m.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-muted font-medium break-all p-1 text-center line-clamp-3">{m.url}</div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      disabled={submitting || isUploading}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger disabled:hidden"
                      title="Xóa"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {uploadingFiles.map((file) => (
                  <div key={file.id} className="relative aspect-square rounded-lg border border-border bg-surface-alt overflow-hidden flex flex-col items-center justify-center gap-1">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-[10px] text-muted font-medium">Đang tải...</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous */}
          <label className="flex items-center gap-2.5 cursor-pointer mt-4 select-none">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              disabled={submitting || isUploading}
              className="w-4 h-4 rounded text-primary focus:ring-primary-soft border-border-strong"
            />
            <span className="text-sm text-text font-medium">Đánh giá ẩn danh</span>
          </label>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting || isUploading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-alt hover:bg-border transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting || isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}