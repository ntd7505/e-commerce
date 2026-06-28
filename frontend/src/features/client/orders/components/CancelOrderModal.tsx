import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

export type CancelOrderModalProps = {
  open: boolean;
  title: string;
  description?: string;
  submitLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export function CancelOrderModal({
  open,
  title,
  description,
  submitLabel = "Xác nhận hủy đơn",
  loading = false,
  onClose,
  onSubmit,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
      setTouched(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const trimmed = reason.trim();
  const isEmpty = touched && trimmed.length === 0;
  const tooLong = reason.length > 500;
  const invalid = isEmpty || tooLong;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (trimmed.length === 0 || tooLong) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-text">{title}</h3>
            {description && <p className="text-sm text-muted mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-muted hover:text-muted p-1 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <label htmlFor="cancel-reason" className="block text-sm font-semibold text-text mb-2">
            Lý do hủy đơn <span className="text-danger">*</span>
          </label>
          <textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            disabled={loading}
            placeholder="Nhập lý do bạn muốn hủy đơn hàng này..."
            className={`w-full rounded-xl border px-3.5 py-3 text-sm text-text placeholder:text-muted outline-none transition-colors resize-none focus:ring-2 ${
              invalid
                ? "border-danger focus:ring-danger-soft"
                : "border-border-strong focus:border-primary focus:ring-primary-soft"
            }`}
          />
          {isEmpty && (
            <p className="mt-2 text-xs text-danger font-medium">Vui lòng nhập lý do hủy đơn.</p>
          )}
          {tooLong && (
            <p className="mt-2 text-xs text-danger font-medium">Lý do không được vượt quá 500 ký tự.</p>
          )}
          <p className="mt-2 text-xs text-muted text-right">{reason.length}/500</p>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text bg-surface-alt hover:bg-border transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-danger hover:bg-danger-hover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
