import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItemResponse } from '../../../../features/client/cart/cartTypes';
import { formatCurrency } from '../../../../utils/formatters';

interface CartItemCardProps {
  item: CartItemResponse;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

export default function CartItemCard({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const itemId = item.id ?? item.productVariantId;
  const [loading, setLoading] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Sync local quantity if item.quantity changes from outside
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await onUpdateQuantity(itemId, newQuantity);
    } catch {
      setLocalQuantity(item.quantity); // rollback
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')) {
      setLoading(true);
      try {
        await onRemove(itemId);
      } catch {
        setLoading(false);
      }
    }
  };

  const productHref = item.productSlug ? `/products/${item.productSlug}` : '/products';

  return (
    <div className={`bg-surface rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-border shadow-sm transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(itemId, e.target.checked)}
        className="h-5 w-5 rounded border-border-strong border-2 text-primary focus:ring-0 cursor-pointer"
      />
      <Link to={productHref} className="w-24 h-24 rounded-lg bg-surface flex-shrink-0 flex items-center justify-center overflow-hidden border border-border group">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="text-muted group-hover:scale-105 transition-transform duration-300">
            <Box className="w-8 h-8" />
          </div>
        )}
      </Link>
      <div className="flex-1 flex flex-col gap-1 w-full md:w-auto">
        <Link to={productHref} className="text-text text-base md:text-lg font-bold leading-tight line-clamp-2 hover:text-primary transition-colors">
          {item.productName}
        </Link>
        <p className="text-muted text-sm">Phân loại: {item.variantName}</p>
        <p className="text-muted text-xs">SKU: {item.sku}</p>
        <div className="mt-2 text-primary font-bold text-lg">{formatCurrency(item.unitPrice)}</div>
      </div>
      <div className="flex items-center justify-between w-full md:w-auto gap-8">
        <div className="flex items-center border border-border-strong rounded-lg h-10 overflow-hidden">
          <button
            onClick={() => handleQuantityChange(localQuantity - 1)}
            disabled={localQuantity <= 1 || loading}
            className="px-3 h-full hover:bg-surface-alt transition-colors text-text border-r border-border-strong disabled:opacity-50 flex items-center justify-center"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="px-4 font-bold text-sm min-w-[40px] text-center">{localQuantity}</div>
          <button
            onClick={() => handleQuantityChange(localQuantity + 1)}
            disabled={loading}
            className="px-3 h-full hover:bg-surface-alt transition-colors text-text border-l border-border-strong disabled:opacity-50 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-right min-w-[120px] hidden md:block">
          <div className="text-sm text-muted">Thành tiền</div>
          <div className="text-text font-black">{formatCurrency(item.lineTotal)}</div>
        </div>
        <button onClick={handleRemove} className="p-2 text-muted hover:text-danger transition-colors" title="Xoá">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
