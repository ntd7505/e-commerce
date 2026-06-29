import React, { useEffect, useState } from 'react';
import ProductCard from '../../../../components/client/ProductCard';
import type { ProductResponse } from '../clientProductApi';
import { formatCurrency, calculateDiscountPercent } from '../../../../utils/formatters';
import { AlertCircle, Zap } from 'lucide-react';
import { useAddToCartAction } from '../../cart/hooks/useAddToCartAction';
import { Link } from 'react-router-dom';

type Props = {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
};

/* ──────────── Skeleton card ──────────── */
const SkeletonCard = () => (
  <div className="bg-surface rounded-lg overflow-hidden border border-border h-full flex flex-col animate-pulse">
    <div className="w-full aspect-square bg-border" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-4 bg-border rounded w-full" />
      <div className="h-4 bg-border rounded w-2/3" />
      <div className="h-5 bg-border rounded w-1/2 mt-1" />
      <div className="h-3 bg-surface-alt rounded w-1/3" />
    </div>
  </div>
);

const FlashSaleSection: React.FC<Props> = ({ products, loading, error }) => {
  const [timeLeft, setTimeLeft] = useState<number>(7200);
  const { handleAddToCart } = useAddToCartAction();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saleEnded = timeLeft <= 0;
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
  
  const displayedProducts = products.slice(0, 5);

  return (
    <section className="w-full" data-purpose="flash-sale-section">
      <div className="bg-surface border border-danger/10 rounded-2xl p-5 lg:p-6 shadow-sm shadow-danger/5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-danger text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">Flash Sale</div>
            <div className="text-sm font-medium text-text">Kết thúc sau</div>
            {!saleEnded ? (
              <div className="flex items-center gap-1.5">
                <div className="bg-text text-white text-sm px-2 py-1 rounded font-bold leading-none">{formatTime(hours)}</div>
                <div className="text-sm text-muted font-bold">:</div>
                <div className="bg-text text-white text-sm px-2 py-1 rounded font-bold leading-none">{formatTime(minutes)}</div>
                <div className="text-sm text-muted font-bold">:</div>
                <div className="bg-text text-white text-sm px-2 py-1 rounded font-bold leading-none">{formatTime(seconds)}</div>
              </div>
            ) : (
               <div className="text-xs text-muted font-medium">Đã kết thúc</div>
            )}
          </div>
          {products.length > 0 && (
            <Link 
              to="/products"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
            >
              Xem tất cả &rarr;
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-danger-soft rounded-xl border border-danger-soft border-dashed">
            <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center shadow-sm mb-3">
              <AlertCircle className="w-7 h-7 text-danger" />
            </div>
            <p className="text-danger font-medium mb-1">Không thể tải Flash Sale</p>
            <p className="text-sm text-danger/70">Vui lòng thử lại sau</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-xl flex flex-col items-center">
            <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-muted" />
            </div>
            <p className="text-muted font-medium">Chưa có Flash Sale nào đang diễn ra</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 transition-all">
            {displayedProducts.map((product) => {
              const thumbnailImage = product.media?.find(m => m.thumbnail)?.url || product.media?.[0]?.url || '';

              const firstVariant = product.variants?.[0];
              const currentPrice = firstVariant?.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
              const originalPrice = firstVariant?.price > currentPrice ? firstVariant.price : null;

              const validVariant = product.variants?.find(v => v.active && (!('deleted' in v) || !(v as Record<string, unknown>).deleted) && v.stockQuantity > 0);
              const displayVariant = validVariant || firstVariant;

              return (
                <ProductCard
                  key={product.id}
                  image={thumbnailImage}
                  name={product.name}
                  slug={product.slug}
                  price={displayVariant ? formatCurrency(currentPrice) : "Chưa có giá"}
                  originalPrice={originalPrice ? formatCurrency(originalPrice) : ""}
                  discountBadge={originalPrice ? calculateDiscountPercent(originalPrice, currentPrice) : ""}
                  isFlashSale={true}
                  saleEnded={saleEnded}
                  onAddToCart={validVariant ? () => handleAddToCart(validVariant.id, 1, product.name) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlashSaleSection;
