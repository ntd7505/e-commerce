import React from 'react';
import type { ProductResponse, ProductVariantResponse } from '../../../../features/client/home/clientProductApi';

interface ProductSpecificationsProps {
  product: ProductResponse;
  selectedVariant: ProductVariantResponse | null;
}

export default function ProductSpecifications({ product, selectedVariant }: ProductSpecificationsProps) {
  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="w-full max-w-3xl border border-border-strong rounded-2xl overflow-hidden">
      <div className="flex border-b border-border-strong last:border-b-0 text-sm">
        <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
          Thương hiệu
        </div>
        <div className="w-2/3 p-4 text-text font-medium">
          {product.brand?.name || 'Đang cập nhật'}
        </div>
      </div>

      <div className="flex border-b border-border-strong last:border-b-0 text-sm">
        <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
          Danh mục
        </div>
        <div className="w-2/3 p-4 text-text font-medium">
          {product.category?.name || 'Đang cập nhật'}
        </div>
      </div>

      {selectedVariant && (
        <>
          <div className="flex border-b border-border-strong last:border-b-0 text-sm">
            <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
              SKU
            </div>
            <div className="w-2/3 p-4 text-text font-medium uppercase">
              {selectedVariant.sku}
            </div>
          </div>

          <div className="flex border-b border-border-strong last:border-b-0 text-sm">
            <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
              Phiên bản
            </div>
            <div className="w-2/3 p-4 text-text font-medium">
              {selectedVariant.variantName}
            </div>
          </div>

          <div className="flex border-b border-border-strong last:border-b-0 text-sm">
            <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
              Tình trạng
            </div>
            <div className={`w-2/3 p-4 font-medium ${inStock ? 'text-success' : 'text-danger'}`}>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </div>
          </div>
        </>
      )}

      <div className="flex border-b border-border-strong last:border-b-0 text-sm">
        <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
          Bảo hành
        </div>
        <div className="w-2/3 p-4 text-text font-medium">
          Chính hãng
        </div>
      </div>

      <div className="flex border-b border-border-strong last:border-b-0 text-sm">
        <div className="w-1/3 bg-surface p-4 text-muted font-medium border-r border-border-strong">
          Giao hàng
        </div>
        <div className="w-2/3 p-4 text-text font-medium">
          Toàn quốc
        </div>
      </div>
    </div>
  );
}
