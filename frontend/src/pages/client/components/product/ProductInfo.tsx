import React from 'react';
import { Star } from 'lucide-react';
import type { 
  ProductResponse, 
  ProductVariantResponse,
  ReviewSummaryResponse 
} from '../../../../features/client/home/clientProductApi';
import { formatCurrency, calculateDiscountPercent } from '../../../../utils/formatters';

interface ProductInfoProps {
  product: ProductResponse;
  selectedVariant: ProductVariantResponse | null;
  reviewSummary: ReviewSummaryResponse | null;
  onVariantSelect: (variant: ProductVariantResponse) => void;
}

export default function ProductInfo({ 
  product, 
  selectedVariant, 
  reviewSummary,
  onVariantSelect 
}: ProductInfoProps) {
  
  const currentPrice = selectedVariant?.salePrice && selectedVariant.salePrice > 0
    ? selectedVariant.salePrice
    : selectedVariant?.price || 0;
    
  const originalPrice = selectedVariant?.price && selectedVariant.price > currentPrice 
    ? selectedVariant.price 
    : null;

  return (
    <div className="flex-1 flex flex-col">
      {product.brand && (
        <div className="mb-2">
          <a href={`/products?brandId=${product.brand.id}`} className="text-blue-600 font-semibold text-sm hover:underline">
            Thương hiệu: {product.brand.name}
          </a>
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
        {product.name}
      </h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <span className="text-lg font-bold mr-1">{reviewSummary?.averageRating?.toFixed(1) || '0.0'}</span>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(reviewSummary?.averageRating || 0) ? 'fill-current' : 'text-gray-300 fill-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">({reviewSummary?.totalReviews || 0} đánh giá)</span>
        </div>
        {/* Giả lập số bán nếu backend không có */}
        <div className="h-4 w-px bg-gray-200"></div>
        <div className="text-gray-500 text-sm">Đang bán</div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-blue-600">{formatCurrency(currentPrice)}</span>
          {originalPrice && (
            <>
              <span className="text-gray-500 line-through text-lg">{formatCurrency(originalPrice)}</span>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">
                {calculateDiscountPercent(originalPrice, currentPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-900 mb-3">Phân loại:</p>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onVariantSelect(variant)}
                disabled={!variant.active || variant.stockQuantity <= 0}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedVariant?.id === variant.id
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-blue-600'
                }`}
              >
                {variant.variantName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Điểm nổi bật tĩnh (Backend không có field riêng cho cái này, fallback vào shortDescription nếu có) */}
      {product.shortDescription && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-bold text-gray-900 mb-3">Điểm nổi bật:</p>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.shortDescription}
          </div>
        </div>
      )}
    </div>
  );
}
