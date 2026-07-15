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
  <div className="bg-surface rounded-2xl overflow-hidden border border-border h-full flex flex-col animate-pulse">
    <div className="w-full aspect-square bg-border" />
    <div className="p-3 pt-4 flex flex-col gap-2">
      <div className="h-4 bg-border rounded w-full" />
      <div className="h-4 bg-border rounded w-3/4" />
      <div className="h-4 bg-border rounded w-1/2 mt-1" />
    </div>
  </div>
);

const RecommendedSection: React.FC<Props> = ({ products, loading, error }) => {
  const { handleAddToCart } = useAddToCartAction();

  return (
    <section className="w-full mt-2 mb-10" data-purpose="recommendations">
      <div className="flex items-center gap-2 mb-6 px-1">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-xl lg:text-2xl font-bold text-text">Gợi ý hôm nay</h3>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-danger-soft rounded-xl border border-danger-soft border-dashed">
          <div className="w-14 h-14 bg-surface rounded-full flex items-center justify-center shadow-sm mb-3">
            <AlertCircle className="w-7 h-7 text-danger" />
          </div>
          <p className="text-danger font-medium mb-1">Không thể tải sản phẩm</p>
          <p className="text-sm text-danger/70">Vui lòng thử lại sau</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-surface rounded-xl flex items-center">
          <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center shadow-sm mb-3">
            <Sparkles className="w-8 h-8 text-muted" />
          </div>
          <p className="text-muted font-medium mb-1">Chưa có gợi ý nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
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
                rating={product.rating}
                soldCount={product.soldCount}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
