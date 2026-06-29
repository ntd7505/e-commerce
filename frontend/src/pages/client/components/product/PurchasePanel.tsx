import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, ShoppingCart, CreditCard } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import type { ProductVariantResponse } from '../../../../features/client/home/clientProductApi';

interface PurchasePanelProps {
  selectedVariant: ProductVariantResponse | null;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  addingToCart?: boolean;
  buyingNow?: boolean;
}

export default function PurchasePanel({
  selectedVariant,
  quantity,
  onQuantityChange,
  onBuyNow,
  onAddToCart,
  addingToCart,
  buyingNow
}: PurchasePanelProps) {
  const stock = selectedVariant?.stockQuantity || 0;


  return (
    <div className="w-full lg:w-[320px] h-fit lg:sticky lg:top-24 shrink-0">
      <div className="bg-gradient-to-br from-surface to-primary-soft/10 border border-primary/20 rounded-2xl p-6 shadow-sm shadow-primary/5">
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-text">Giao tới</span>
            <span className="text-sm font-bold text-text">Toàn quốc</span>
          </div>

          <div className="bg-surface p-3 rounded-xl text-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-text font-medium">
                <Truck className="w-4 h-4 text-muted" />
                Giao hàng tiêu chuẩn
              </div>
              <span className="text-success font-bold">Miễn phí</span>
            </div>
            <p className="text-muted text-xs mt-1 ml-5">
              Dự kiến nhận hàng: Hôm nay hoặc 2-3 ngày
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-text">Số lượng:</p>
            <span className="text-xs font-medium">
              {stock > 0 ? (
                <span className="text-success">Còn {stock} sản phẩm</span>
              ) : (
                <span className="text-danger">Hết hàng</span>
              )}
            </span>
          </div>
          <div className="flex items-center border border-border-strong rounded-lg w-fit h-10 overflow-hidden bg-surface">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={!selectedVariant || stock === 0}
              className="w-10 h-full flex items-center justify-center text-lg text-muted hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-border-strong"
            >
              -
            </button>
            <input
              className="w-12 h-full border-none text-center font-bold focus:ring-0 text-sm p-0 disabled:bg-surface"
              type="text"
              value={quantity}
              readOnly
              disabled={!selectedVariant || stock === 0}
            />
            <button
              onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
              disabled={!selectedVariant || stock === 0 || quantity >= stock}
              className="w-10 h-full flex items-center justify-center text-lg text-muted hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-border-strong"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onBuyNow}
            disabled={stock === 0 || !selectedVariant || buyingNow || addingToCart}
            loading={buyingNow}
            leftIcon={<CreditCard className="w-5 h-5" />}
            className="shadow-[0_4px_14px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all"
          >
            Mua ngay
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={onAddToCart}
            disabled={stock === 0 || !selectedVariant || addingToCart || buyingNow}
            loading={addingToCart}
            leftIcon={<ShoppingCart className="w-5 h-5" />}
            className="border-primary text-primary hover:bg-primary-soft"
          >
            Thêm vào giỏ hàng
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck className="w-4 h-4" />
          <span>Thanh toán bảo mật · Hỗ trợ đổi trả</span>
        </div>
      </div>
    </div>
  );
}
