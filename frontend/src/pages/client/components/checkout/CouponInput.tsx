import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cartApi } from '../../../../features/client/cart/cartApi';
import type { CouponResponse } from '../../../../features/client/cart/cartTypes';
import { formatCurrency } from '../../../../utils/formatters';
import { useAuth } from '../../../../features/auth/AuthProvider';

interface CouponInputProps {
  currentCoupon: string | null;
  subtotalAmount: number;
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
  error?: string | null;
}

export default function CouponInput({ currentCoupon, subtotalAmount, onApply, onRemove, error }: CouponInputProps) {
  const [code, setCode] = useState(currentCoupon || '');
  const [loading, setLoading] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [couponsError, setCouponsError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ prop currentCoupon với state local code
    setCode(currentCoupon || '');
  }, [currentCoupon]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!isAuthenticated) {
        setCoupons([]);
        setLoadingCoupons(false);
        return;
      }
      try {
        setLoadingCoupons(true);
        const data = await cartApi.getAvailableCoupons();
        setCoupons(data);
      } catch (err) {
        console.error(err);
        setCouponsError('Không thể tải danh sách khuyến mãi.');
      } finally {
        setLoadingCoupons(false);
      }
    };
    void fetchCoupons();
  }, [isAuthenticated]);

  const handleApply = async (e?: React.FormEvent, couponCode?: string) => {
    if (e) e.preventDefault();
    const finalCode = couponCode || code.trim();
    if (!finalCode) return;
    
    setLoading(true);
    try {
      await onApply(finalCode);
      if (!couponCode) {
        setCode(finalCode);
      }
      setShowCoupons(false);
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
      <h2 className="text-base font-bold text-text flex items-center gap-2 mb-4">
        <Ticket className="w-4 h-4 text-primary" /> Khuyến mãi
      </h2>

      {currentCoupon ? (
        <div className="flex items-center justify-between bg-success-soft/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="font-bold text-success text-sm uppercase">{currentCoupon}</span>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-xs font-semibold text-muted hover:text-danger transition-colors disabled:opacity-50"
          >
            Bỏ chọn
          </button>
        </div>
      ) : (
        <form onSubmit={e => handleApply(e)} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Nhập mã giảm giá"
            className="flex-1 border border-border-strong rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase placeholder:normal-case placeholder:text-muted"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="bg-text text-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-text/90 disabled:opacity-50 transition-colors"
          >
            Áp dụng
          </button>
        </form>
      )}

      {error && (
        <p className="text-danger text-xs mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}

      {!currentCoupon && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCoupons(!showCoupons)}
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            {showCoupons ? 'Đóng danh sách mã' : 'Chọn mã có sẵn'}
            {showCoupons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showCoupons && (
            <div className="mt-4 pt-2">
              {loadingCoupons ? (
                <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted" /></div>
              ) : couponsError ? (
                <div className="text-danger text-sm">{couponsError}</div>
              ) : coupons.length === 0 ? (
                <div className="text-muted text-sm">Hiện chưa có mã giảm giá khả dụng.</div>
              ) : (
                <div className="flex flex-col">
                  {coupons.map((coupon) => {
                    const isValid = subtotalAmount >= coupon.minOrderAmount;
                    const isCurrent = currentCoupon === coupon.code;
                    
                    return (
                      <div key={coupon.code} className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text text-sm uppercase truncate">{coupon.code}</span>
                          </div>
                          <p className="text-xs text-muted truncate mt-0.5">{coupon.description}</p>
                          {!isValid && (
                            <p className="text-[10px] text-danger mt-1">Đơn tối thiểu {formatCurrency(coupon.minOrderAmount)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleApply(undefined, coupon.code)}
                          disabled={loading || !isValid || isCurrent}
                          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                            !isValid ? 'bg-surface-alt text-muted cursor-not-allowed' : 
                            isCurrent ? 'bg-success-soft text-success cursor-not-allowed' : 
                            'bg-primary-soft text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {isCurrent ? 'Đang dùng' : !isValid ? 'Không đủ ĐK' : 'Áp dụng'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
