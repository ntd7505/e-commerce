import React, { useState } from 'react';
import { Ticket, CheckCircle2, AlertCircle } from 'lucide-react';

interface CouponInputProps {
  currentCoupon: string | null;
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
  error?: string | null;
}

export default function CouponInput({ currentCoupon, onApply, onRemove, error }: CouponInputProps) {
  const [code, setCode] = useState(currentCoupon || '');
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      await onApply(code.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await onRemove();
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-border shadow-sm mb-6">
      <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
        <Ticket className="w-5 h-5 text-primary" /> Khuyến mãi
      </h2>

      {currentCoupon ? (
        <div className="flex items-center justify-between bg-primary-soft border border-primary-soft rounded-lg p-4">
          <div className="flex items-center gap-3 text-primary font-medium">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Đã áp dụng mã: <span className="font-bold uppercase">{currentCoupon}</span>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-muted hover:text-danger font-medium text-sm transition-colors disabled:opacity-50"
          >
            Bỏ chọn
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Nhập mã giảm giá..."
            className="flex-1 border border-border-strong rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-blue-600 outline-none uppercase placeholder:normal-case"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            Áp dụng
          </button>
        </form>
      )}

      {error && <p className="text-danger text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
    </div>
  );
}
