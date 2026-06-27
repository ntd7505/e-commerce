import React from 'react';
import { Star, Tag, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const mockSoldCount = Math.max(120, product.name.length * 43);
  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Brand & Category */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        {product.brand && (
          <>
            <span className="text-gray-500">Thương hiệu:</span>
            <Link to={`/products?brandId=${product.brand.id}`} className="text-blue-600 font-semibold hover:underline">
              {product.brand.name}
            </Link>
          </>
        )}
        {product.brand && product.category && <span className="text-gray-300">|</span>}
        {product.category && (
          <Link to={`/products?categoryId=${product.category.id}`} className="text-gray-600 hover:text-blue-600">
            {product.category.name}
          </Link>
        )}
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
        {product.name}
      </h1>
      
      {/* Meta Stats: Rating, Sold, SKU, Stock */}
      <div className="flex items-center flex-wrap gap-y-2 mb-5">
        <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3 mr-3">
          <span className="text-sm font-bold text-gray-900">{reviewSummary?.averageRating?.toFixed(1) || '0.0'}</span>
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= Math.round(reviewSummary?.averageRating || 0) ? 'fill-current' : 'text-gray-300 fill-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm hover:text-blue-600 cursor-pointer">({reviewSummary?.totalReviews || 0} đánh giá)</span>
        </div>
        
        <div className="text-gray-500 text-sm border-r border-gray-200 pr-3 mr-3">
          Đã bán {mockSoldCount >= 1000 ? (mockSoldCount/1000).toFixed(1) + 'k+' : mockSoldCount}
        </div>

        {selectedVariant && (
          <>
            <div className="text-gray-500 text-sm border-r border-gray-200 pr-3 mr-3">
              SKU: <span className="font-medium text-gray-700">{selectedVariant.sku}</span>
            </div>
            <div className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </div>
          </>
        )}
      </div>

      {/* Price Box */}
      <div className="bg-gray-50 p-4 rounded-xl mb-5 border border-gray-100">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-red-500">{formatCurrency(currentPrice)}</span>
          {originalPrice && (
            <>
              <span className="text-gray-400 line-through text-lg">{formatCurrency(originalPrice)}</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                -{calculateDiscountPercent(originalPrice, currentPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Promo Box */}
      <div className="border border-blue-100 rounded-xl mb-6 overflow-hidden">
        <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-blue-800">Ưu đãi kèm theo</span>
        </div>
        <div className="p-4 bg-white flex flex-col gap-2">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>Giảm thêm 5% với mã <strong>NEXA5</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>Freeship cho đơn từ 500k</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span>Trả góp 0% qua thẻ tín dụng</span>
          </div>
        </div>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-gray-900">Phân loại:</p>
            {selectedVariant && (
              <span className="text-sm text-gray-500">{selectedVariant.variantName}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isDisabled = !variant.active || variant.stockQuantity <= 0;
              
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantSelect(variant)}
                  disabled={isDisabled}
                  className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  <span>{variant.variantName}</span>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-r-[16px] border-t-blue-600 border-r-transparent">
                      <CheckCircle2 className="absolute -top-[15px] -left-1 w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Điểm nổi bật tĩnh */}
      {product.shortDescription && (
        <div className="border-t border-gray-100 pt-5 mt-auto">
          <p className="text-sm font-bold text-gray-900 mb-2">Điểm nổi bật:</p>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.shortDescription}
          </div>
        </div>
      )}
    </div>
  );
}
