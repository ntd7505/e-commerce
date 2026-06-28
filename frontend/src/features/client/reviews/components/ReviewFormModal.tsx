import { useEffect, useState } from "react";
import { Loader2, X, Star, Link2, Plus, Trash2 } from "lucide-react";
import type { CreateReviewRequest, ProductReviewMediaRequest, ReviewMediaType } from "../reviewTypes";

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
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [media, setMedia] = useState<ProductReviewMediaRequest[]>([]);
  const [touched, setTouched] = useState(false);
  const [mediaUrlDraft, setMediaUrlDraft] = useState("");

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
      { url, mediaType: "IMAGE" as ReviewMediaType, sortOrder: prev.length },
    ]);
    setMediaUrlDraft("");
  }

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
            <span className="block text-sm font-semibold text-text mb-1.5">
              Hình ảnh / Video (tùy chọn, tối đa 5)
            </span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={mediaUrlDraft}
                  onChange={(e) => setMediaUrlDraft(e.target.value)}
                  disabled={submitting || media.length >= 5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMedia();
                    }
                  }}
                  placeholder="Dán URL hình ảnh..."
                  className={`${fieldClass(false)} pl-9`}
                />
              </div>
              <button
                type="button"
                onClick={addMedia}
                disabled={submitting || !mediaUrlDraft.trim() || media.length >= 5}
                className="inline-flex items-center gap-1 rounded-xl border border-border-strong bg-surface px-3 py-2.5 text-sm font-semibold text-text hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>
            {mediaCountError && (
              <p className="mt-1.5 text-xs text-danger font-medium">Tối đa 5 media.</p>
            )}
            {media.length > 0 && (
              <div className="mt-2 space-y-2">
                {media.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-lg bg-surface border border-border px-3 py-2">
                    <span className="text-xs text-muted shrink-0">{idx + 1}.</span>
                    <span className="flex-1 text-sm text-text truncate">{m.url}</span>
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      disabled={submitting}
                      className="text-muted hover:text-danger p-0.5 disabled:opacity-50"
                      aria-label="Xóa media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              disabled={submitting}
              className="w-4 h-4 rounded text-primary focus:ring-primary-soft border-border-strong"
            />
            <span className="text-sm text-text font-medium">Đánh giá ẩn danh</span>
          </label>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-alt hover:bg-border transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
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