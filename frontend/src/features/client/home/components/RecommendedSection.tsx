import React from 'react';
import ProductCard from '../../../../components/client/ProductCard';
import type { ProductResponse } from '../clientProductApi';
import { formatCurrency, calculateDiscountPercent } from '../../../../utils/formatters';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useAddToCartAction } from '../../cart/hooks/useAddToCartAction';

type Props = {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
};

/* ──────────── Skeleton card ──────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 h-full flex flex-col animate-pulse">
    <div className="w-full aspect-square bg-gray-200" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-5 bg-gray-200 rounded w-1/2 mt-1" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

const RecommendedSection: React.FC<Props> = ({ products, loading, error }) => {
  const { handleAddToCart } = useAddToCartAction();

  return (
    <section className="w-full mt-2 mb-10" data-purpose="recommendations">
      <h3 className="text-2xl font-bold mb-4">Gợi ý hôm nay</h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50/50 rounded-xl border border-red-100 border-dashed">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-red-600 font-medium mb-1">Không thể tải sản phẩm</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <Sparkles className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-700 font-medium mb-1">Chưa có gợi ý nào</p>
          <p className="text-gray-500 text-sm">Chúng tôi đang cập nhật sản phẩm mới cho bạn!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => {
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
                isFlashSale={false}
                onAddToCart={validVariant ? () => handleAddToCart(validVariant.id, 1, product.name) : undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
