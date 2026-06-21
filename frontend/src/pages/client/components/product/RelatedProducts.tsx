import React from 'react';
import type { ProductResponse } from '../../../../features/client/home/clientProductApi';
import ProductCard from '../../../../components/client/ProductCard';
import { formatCurrency, calculateDiscountPercent } from '../../../../utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAddToCartAction } from '../../../../features/client/cart/hooks/useAddToCartAction';

interface RelatedProductsProps {
  products: ProductResponse[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { handleAddToCart } = useAddToCartAction();

  if (!products || products.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-blue-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-blue-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((item) => {
          const thumbnailImage = item.media?.find((media) => media.thumbnail)?.url || item.media?.[0]?.url || '';
          const firstVariant = item.variants?.[0];
          const itemPrice = firstVariant?.salePrice && firstVariant.salePrice > 0 ? firstVariant.salePrice : firstVariant?.price || 0;
          const itemOriginalPrice = firstVariant?.price && firstVariant.price > itemPrice ? firstVariant.price : null;

          const validVariant = item.variants?.find(v => v.active && (!('deleted' in v) || !(v as Record<string, unknown>).deleted) && v.stockQuantity > 0);
          const displayVariant = validVariant || firstVariant;

          return (
            <ProductCard
              key={item.id}
              image={thumbnailImage}
              name={item.name}
              slug={item.slug}
              price={displayVariant ? formatCurrency(itemPrice) : "Chưa có giá"}
              originalPrice={itemOriginalPrice ? formatCurrency(itemOriginalPrice) : ''}
              discountBadge={itemOriginalPrice ? calculateDiscountPercent(itemOriginalPrice, itemPrice) : ''}
              isFlashSale={false}
              onAddToCart={validVariant ? () => handleAddToCart(validVariant.id, 1, item.name) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
