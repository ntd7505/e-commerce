import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cartApi } from '../../../../features/client/cart/cartApi';
import type { CouponResponse } from '../../../../features/client/cart/cartTypes';
import { formatCurrency } from '../../../../utils/formatters';

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
  
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [couponsError, setCouponsError] = useState<string | null>(null);

  useEffect(() => {
    setCode(currentCoupon || '');
  }, [currentCoupon]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const data = await cartApi.getAvailableCoupons();
        setCoupons(data);
      } catch (err) {
        setCouponsError('Không thể tải danh sách khuyến mãi.');
      } finally {
        setLoadingCoupons(false);
      }
    };
    void fetchCoupons();
  }, []);

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
        <div className="flex items-center justify-between bg-primary-soft border border-primary-soft rounded-lg p-4 mb-4">
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
        <form onSubmit={e => handleApply(e)} className="flex gap-2 mb-4">
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

      {error && <p className="text-danger text-sm mt-2 mb-4 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}

      <div className="mt-6">
        <h3 className="text-sm font-bold text-text mb-3">Mã giảm giá khả dụng</h3>
        {loadingCoupons ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
        ) : couponsError ? (
          <div className="text-danger text-sm">{couponsError}</div>
        ) : coupons.length === 0 ? (
          <div className="text-muted text-sm">Hiện chưa có mã giảm giá khả dụng.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {coupons.map((coupon) => {
              const isValid = subtotalAmount >= coupon.minOrderAmount;
              const isCurrent = currentCoupon === coupon.code;
              
              return (
                <div key={coupon.code} className={`border ${isCurrent ? 'border-primary bg-primary-soft' : 'border-border'} rounded-lg p-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between transition-colors`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text uppercase">{coupon.code}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-medium uppercase">Đang dùng</span>
                      )}
                    </div>
                    <p className="text-sm text-text font-medium mb-1">{coupon.description}</p>
                    <div className="text-xs text-muted flex flex-col gap-0.5">
                      <span>Đơn tối thiểu {formatCurrency(coupon.minOrderAmount)}</span>
                      {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                        <span>Giảm tối đa {formatCurrency(coupon.maxDiscountAmount)}</span>
                      )}
                      <span>HSD: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}</span>
                      {coupon.usageLimit !== undefined && coupon.usedCount !== undefined && (
                        <span>Còn lại: {Math.max(0, coupon.usageLimit - coupon.usedCount)} lượt</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center shrink-0 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleApply(undefined, coupon.code)}
                      disabled={loading || !isValid || isCurrent}
                      className={`${!isValid ? 'bg-border text-muted cursor-not-allowed' : isCurrent ? 'bg-success text-white cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white'} px-4 py-1.5 rounded-md text-sm font-medium transition-colors`}
                    >
                      {isCurrent ? 'Đang dùng' : !isValid ? 'Chưa đủ điều kiện' : 'Áp dụng'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
