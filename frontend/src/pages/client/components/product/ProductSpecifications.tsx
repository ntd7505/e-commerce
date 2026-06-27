import React from 'react';
import type { ProductResponse, ProductVariantResponse } from '../../../../features/client/home/clientProductApi';

interface ProductSpecificationsProps {
  product: ProductResponse;
  selectedVariant: ProductVariantResponse | null;
}

export default function ProductSpecifications({ product, selectedVariant }: ProductSpecificationsProps) {
  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;

  return (
    <div className="w-full max-w-3xl border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
        <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
          Thương hiệu
        </div>
        <div className="w-2/3 p-4 text-gray-900 font-medium">
          {product.brand?.name || 'Đang cập nhật'}
        </div>
      </div>

      <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
        <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
          Danh mục
        </div>
        <div className="w-2/3 p-4 text-gray-900 font-medium">
          {product.category?.name || 'Đang cập nhật'}
        </div>
      </div>

      {selectedVariant && (
        <>
          <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
            <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
              SKU
            </div>
            <div className="w-2/3 p-4 text-gray-900 font-medium uppercase">
              {selectedVariant.sku}
            </div>
          </div>

          <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
            <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
              Phiên bản
            </div>
            <div className="w-2/3 p-4 text-gray-900 font-medium">
              {selectedVariant.variantName}
            </div>
          </div>

          <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
            <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
              Tình trạng
            </div>
            <div className={`w-2/3 p-4 font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? 'Còn hàng' : 'Hết hàng'}
            </div>
          </div>
        </>
      )}

      <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
        <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
          Bảo hành
        </div>
        <div className="w-2/3 p-4 text-gray-900 font-medium">
          Chính hãng
        </div>
      </div>

      <div className="flex border-b border-gray-200 last:border-b-0 text-sm">
        <div className="w-1/3 bg-gray-50 p-4 text-gray-600 font-medium border-r border-gray-200">
          Giao hàng
        </div>
        <div className="w-2/3 p-4 text-gray-900 font-medium">
          Toàn quốc
        </div>
      </div>
    </div>
  );
}
