import React, { useEffect, useState } from 'react';
import ProductCard from '../../../../components/client/ProductCard';
import type { ProductResponse } from '../clientProductApi';
import { formatCurrency, calculateDiscountPercent } from '../../../../utils/formatters';
import { AlertCircle, Zap } from 'lucide-react';

type Props = {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
};

/* ──────────── Skeleton card ──────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 h-full flex flex-col animate-pulse">
    <div className="w-full aspect-square bg-gray-200" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-1/2 mt-1" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

const FlashSaleSection: React.FC<Props> = ({ products, loading, error }) => {
  const [timeLeft, setTimeLeft] = useState<number>(7200);

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
  }, []);

  const saleEnded = timeLeft <= 0;
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft > 0 && timeLeft <= 300; // < 5 minutes

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <section className="w-full mt-2" data-purpose="flash-sale-section">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <h3 className="text-2xl font-bold italic text-nexa-blue">Flash Sale</h3>
          </div>

          {saleEnded ? (
            <div className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded text-sm font-medium">
              <i className="fa-solid fa-clock"></i>
              Flash Sale đã kết thúc
            </div>
          ) : (
            <div className={`flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded ${isUrgent ? 'animate-pulse' : ''}`}>
              <span className="text-xs font-bold">KẾT THÚC TRONG:</span>
              <div className="flex gap-1 font-mono text-sm">
                <span className="bg-black px-1.5 py-0.5 rounded">{formatTime(hours)}</span>:
                <span className="bg-black px-1.5 py-0.5 rounded">{formatTime(minutes)}</span>:
                <span className="bg-black px-1.5 py-0.5 rounded">{formatTime(seconds)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50/50 rounded-xl border border-red-100 border-dashed">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-red-600 font-medium mb-1">Không thể tải Flash Sale</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <Zap className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Chưa có sản phẩm Flash Sale</p>
            <p className="text-gray-500 text-sm">Hãy quay lại sau để xem các deal hot nhất!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => {
              const thumbnailImage = product.media?.find(m => m.thumbnail)?.url || product.media?.[0]?.url || '';

              const firstVariant = product.variants?.[0];
              const currentPrice = firstVariant?.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
              const originalPrice = firstVariant?.price > currentPrice ? firstVariant.price : null;

              return (
                <ProductCard
                  key={product.id}
                  image={thumbnailImage}
                  name={product.name}
                  slug={product.slug}
                  price={formatCurrency(currentPrice)}
                  originalPrice={originalPrice ? formatCurrency(originalPrice) : ""}
                  discountBadge={originalPrice ? calculateDiscountPercent(originalPrice, currentPrice) : ""}
                  isFlashSale={true}
                  saleEnded={saleEnded}
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
