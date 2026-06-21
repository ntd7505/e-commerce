import React from 'react';
import { Truck } from 'lucide-react';
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
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Giao hàng tận nơi</p>
            <p className="text-sm font-bold">Toàn quốc</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Giao hàng tiêu chuẩn</span>
            <span className="text-green-600 font-bold">Miễn phí</span>
          </div>
          <p className="text-gray-900">Cho đơn hàng từ 500k</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-900">Số lượng:</p>
            <span className="text-xs text-gray-500">
              {stock > 0 ? `Còn ${stock} sản phẩm` : <span className="text-red-500">Hết hàng</span>}
            </span>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg w-fit h-10">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={!selectedVariant || stock === 0}
              className="w-10 h-full flex items-center justify-center text-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-10 h-full flex items-center justify-center text-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onBuyNow}
            disabled={stock === 0 || !selectedVariant || buyingNow || addingToCart}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {buyingNow && <i className="fa-solid fa-spinner fa-spin"></i>}
            Mua ngay
          </button>
          <button
            onClick={onAddToCart}
            disabled={stock === 0 || !selectedVariant || addingToCart || buyingNow}
            className="w-full py-3.5 border border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {addingToCart && <i className="fa-solid fa-spinner fa-spin"></i>}
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
