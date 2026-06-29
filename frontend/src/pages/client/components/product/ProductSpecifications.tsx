import React from 'react';
import type { ProductResponse, ProductVariantResponse } from '../../../../features/client/home/clientProductApi';

interface ProductSpecificationsProps {
  product: ProductResponse;
  selectedVariant: ProductVariantResponse | null;
}

export default function ProductSpecifications({ product, selectedVariant }: ProductSpecificationsProps) {
  const inStock = selectedVariant && selectedVariant.stockQuantity > 0;
  
  const activeSpecs = (product.specifications || [])
    .filter(spec => spec.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (activeSpecs.length > 0) {
    // Group specifications by groupName
    const groupedSpecs = activeSpecs.reduce((acc, spec) => {
      const groupName = spec.groupName?.trim() || 'Thông tin chung';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(spec);
      return acc;
    }, {} as Record<string, typeof activeSpecs>);

    return (
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {Object.entries(groupedSpecs).map(([groupName, specs]) => (
          <div key={groupName} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text">{groupName}</h3>
            <div className="border border-border rounded-lg overflow-hidden bg-canvas">
              {specs.map((spec) => (
                <div key={spec.id || spec.specKey} className="flex flex-col md:flex-row border-b border-border last:border-b-0 text-sm">
                  <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
                    {spec.specKey}
                  </div>
                  <div className="w-full md:w-2/3 p-4 text-text leading-relaxed">
                    {spec.specValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback to legacy specifications
  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      <h3 className="text-lg font-bold text-text">Thông tin chung</h3>
      <div className="border border-border rounded-lg overflow-hidden bg-canvas">
        
        <div className="flex flex-col md:flex-row border-b border-border text-sm">
          <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
            Thương hiệu
          </div>
          <div className="w-full md:w-2/3 p-4 text-text font-medium">
            {product.brand?.name || 'Đang cập nhật'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row border-b border-border text-sm">
          <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
            Danh mục
          </div>
          <div className="w-full md:w-2/3 p-4 text-text font-medium">
            {product.category?.name || 'Đang cập nhật'}
          </div>
        </div>

        {selectedVariant && (
          <>
            <div className="flex flex-col md:flex-row border-b border-border text-sm">
              <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
                SKU
              </div>
              <div className="w-full md:w-2/3 p-4 text-text font-medium uppercase">
                {selectedVariant.sku}
              </div>
            </div>

            <div className="flex flex-col md:flex-row border-b border-border text-sm">
              <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
                Phiên bản
              </div>
              <div className="w-full md:w-2/3 p-4 text-text font-medium">
                {selectedVariant.variantName}
              </div>
            </div>

            <div className="flex flex-col md:flex-row border-b border-border text-sm">
              <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
                Tình trạng
              </div>
              <div className={`w-full md:w-2/3 p-4 font-medium ${inStock ? 'text-success' : 'text-danger'}`}>
                {inStock ? 'Còn hàng' : 'Hết hàng'}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col md:flex-row border-b border-border text-sm">
          <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
            Bảo hành
          </div>
          <div className="w-full md:w-2/3 p-4 text-text font-medium">
            Chính hãng
          </div>
        </div>

        <div className="flex flex-col md:flex-row text-sm">
          <div className="w-full md:w-1/3 bg-[var(--surface-alt)] p-4 text-text-muted font-medium border-b md:border-b-0 md:border-r border-border">
            Giao hàng
          </div>
          <div className="w-full md:w-2/3 p-4 text-text font-medium">
            Toàn quốc
          </div>
        </div>

      </div>
    </div>
  );
}
