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
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <label htmlFor="cancel-reason" className="block text-sm font-semibold text-gray-800 mb-2">
            Lý do hủy đơn <span className="text-red-500">*</span>
          </label>
          <textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            disabled={loading}
            placeholder="Nhập lý do bạn muốn hủy đơn hàng này..."
            className={`w-full rounded-xl border px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors resize-none focus:ring-2 ${
              invalid
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-nexa-blue focus:ring-blue-100"
            }`}
          />
          {isEmpty && (
            <p className="mt-2 text-xs text-red-600 font-medium">Vui lòng nhập lý do hủy đơn.</p>
          )}
          {tooLong && (
            <p className="mt-2 text-xs text-red-600 font-medium">Lý do không được vượt quá 500 ký tự.</p>
          )}
          <p className="mt-2 text-xs text-gray-400 text-right">{reason.length}/500</p>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
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
