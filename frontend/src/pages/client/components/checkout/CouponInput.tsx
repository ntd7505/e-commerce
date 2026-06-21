import React, { useState } from 'react';

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
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <i className="fa-solid fa-ticket text-blue-600"></i> Khuyến mãi
      </h2>
      
      {currentCoupon ? (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 text-blue-800 font-medium">
            <i className="fa-solid fa-circle-check text-green-500"></i>
            Đã áp dụng mã: <span className="font-bold uppercase">{currentCoupon}</span>
          </div>
          <button 
            onClick={handleRemove}
            disabled={loading}
            className="text-gray-500 hover:text-red-500 font-medium text-sm transition-colors disabled:opacity-50"
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
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none uppercase placeholder:normal-case"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={!code.trim() || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Áp dụng
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {error}</p>}
    </div>
  );
}
