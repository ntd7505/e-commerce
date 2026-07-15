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

  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Brand & Category */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        {product.brand && (
          <>
            <span className="text-muted">Thương hiệu:</span>
            <Link to={`/products?brandId=${product.brand.id}`} className="text-primary font-semibold hover:underline">
              {product.brand.name}
            </Link>
          </>
        )}
        {product.brand && product.category && <span className="text-subtle">|</span>}
        {product.category && (
          <Link to={`/products?categoryId=${product.category.id}`} className="text-muted hover:text-primary">
            {product.category.name}
          </Link>
        )}
      </div>
      
      <h1 className="text-wrap-balance text-2xl font-bold text-text leading-tight mb-3">
        {product.name}
      </h1>
      
      {/* Meta Stats: Rating, Sold, SKU, Stock */}
      <div className="flex items-center flex-wrap gap-y-2 mb-5">
        <div className="flex items-center gap-1.5 border-r border-border-strong pr-3 mr-3">
          <span className="text-sm font-bold text-text">{reviewSummary?.averageRating?.toFixed(1) || '0.0'}</span>
          <div className="flex text-warning">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= Math.round(reviewSummary?.averageRating || 0) ? 'fill-current' : 'text-subtle fill-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-muted text-sm hover:text-primary cursor-pointer">({reviewSummary?.totalReviews || 0} đánh giá)</span>
        </div>
        
        <div className="text-muted text-sm border-r border-border-strong pr-3 mr-3">
          Đã bán {(product.soldCount || 0) >= 1000 ? ((product.soldCount || 0)/1000).toFixed(1) + 'k+' : (product.soldCount || 0)}
        </div>

        {selectedVariant && (
          <>
            <div className="text-muted text-sm border-r border-border-strong pr-3 mr-3">
              SKU: <span className="font-medium text-text">{selectedVariant.sku}</span>
            </div>
            <div className={`text-sm font-medium ${inStock ? 'text-success' : 'text-danger'}`}>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </div>
          </>
        )}
      </div>

      {/* Price Box */}
      <div className="bg-surface p-4 rounded-xl mb-5 border border-border">
        <div className="flex flex-wrap items-baseline gap-2 xl:gap-3">
          <span className="text-3xl font-bold text-danger">{formatCurrency(currentPrice)}</span>
          {originalPrice && (
            <>
              <span className="text-muted line-through text-lg shrink-0">{formatCurrency(originalPrice)}</span>
              <span className="bg-danger-soft text-danger text-xs font-bold px-2 py-1 rounded whitespace-nowrap shrink-0">
                -{calculateDiscountPercent(originalPrice, currentPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Promo Box */}
      <div className="border border-blue-100 rounded-xl mb-6 overflow-hidden">
        <div className="bg-primary-soft px-4 py-2.5 border-b border-blue-100 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">Ưu đãi kèm theo</span>
        </div>
        <div className="p-4 bg-surface flex flex-col gap-2">
          <div className="flex items-start gap-2 text-sm text-text">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span>Giảm thêm 5% với mã <strong>NEXA5</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-text">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span>Freeship cho đơn từ 500k</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-text">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span>Trả góp 0% qua thẻ tín dụng</span>
          </div>
        </div>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-text">Phân loại:</p>
            {selectedVariant && (
              <span className="text-sm text-muted">{selectedVariant.variantName}</span>
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
                      ? 'border-primary bg-primary-soft text-primary'
                      : 'border-border-strong bg-surface text-text hover:border-primary hover:text-primary'
                  }`}
                >
                  <span>{variant.variantName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Điểm nổi bật tĩnh */}
      {product.shortDescription && (
        <div className="border-t border-border pt-5 mt-auto">
          <p className="text-sm font-bold text-text mb-2">Điểm nổi bật:</p>
          <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
            {product.shortDescription}
          </div>
        </div>
      )}
    </div>
  );
}
