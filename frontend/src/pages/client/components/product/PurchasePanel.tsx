import React from 'react';
import { Truck, Loader2, ShieldCheck } from 'lucide-react';
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
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">Giao tới</span>
            <span className="text-sm font-bold text-gray-900">Toàn quốc</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl text-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                <Truck className="w-4 h-4 text-gray-500" />
                Giao hàng tiêu chuẩn
              </div>
              <span className="text-green-600 font-bold">Miễn phí</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 ml-5">
              Dự kiến nhận hàng: Hôm nay hoặc 2-3 ngày
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">Số lượng:</p>
            <span className="text-xs font-medium">
              {stock > 0 ? (
                <span className="text-green-600">Còn {stock} sản phẩm</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </span>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg w-fit h-10 overflow-hidden bg-white">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={!selectedVariant || stock === 0}
              className="w-10 h-full flex items-center justify-center text-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-200"
            >
              -
            </button>
            <input
              className="w-12 h-full border-none text-center font-bold focus:ring-0 text-sm p-0 disabled:bg-white"
              type="text"
              value={quantity}
              readOnly
              disabled={!selectedVariant || stock === 0}
            />
            <button
              onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
              disabled={!selectedVariant || stock === 0 || quantity >= stock}
              className="w-10 h-full flex items-center justify-center text-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onBuyNow}
            disabled={stock === 0 || !selectedVariant || buyingNow || addingToCart}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {buyingNow && <Loader2 className="w-4 h-4 animate-spin" />}
            Mua ngay
          </button>
          <button
            onClick={onAddToCart}
            disabled={stock === 0 || !selectedVariant || addingToCart || buyingNow}
            className="w-full py-3.5 border border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-white"
          >
            {addingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
            Thêm vào giỏ hàng
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Thanh toán bảo mật · Hỗ trợ đổi trả</span>
        </div>
      </div>
    </div>
  );
}
