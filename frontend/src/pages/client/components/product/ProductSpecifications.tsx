import React from 'react';
import type { ProductResponse, ProductVariantResponse } from '../../../../features/client/home/clientProductApi';

interface ProductSpecificationsProps {
  product: ProductResponse;
  selectedVariant: ProductVariantResponse | null;
}

export default function ProductSpecifications({ product, selectedVariant }: ProductSpecificationsProps) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {product.brand && (
        <div className="flex border-b border-gray-100 pb-3">
          <span className="w-1/3 text-gray-500">Thương hiệu</span>
          <span className="w-2/3 font-medium">{product.brand.name}</span>
        </div>
      )}
      {product.category && (
        <div className="flex border-b border-gray-100 pb-3">
          <span className="w-1/3 text-gray-500">Danh mục</span>
          <span className="w-2/3 font-medium">{product.category.name}</span>
        </div>
      )}
      {selectedVariant && (
        <>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-1/3 text-gray-500">SKU</span>
            <span className="w-2/3 font-medium">{selectedVariant.sku}</span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-1/3 text-gray-500">Tiền tệ</span>
            <span className="w-2/3 font-medium">{selectedVariant.currency}</span>
          </div>
          <div className="flex border-b border-gray-100 pb-3">
            <span className="w-1/3 text-gray-500">Kho hàng</span>
            <span className="w-2/3 font-medium">
              {selectedVariant.stockQuantity > 0 ? selectedVariant.stockQuantity : 'Hết hàng'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
