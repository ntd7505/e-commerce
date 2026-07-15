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
                <div key={spec.id || spec.specKey} className="flex flex-col md:flex-row text-sm group">
                  <div className="w-full md:w-1/3 bg-primary-soft p-4 text-text-muted font-medium border-border border-b md:border-b-white md:border-r group-last:border-b-0">
                    {spec.specKey}
                  </div>
                  <div className="w-full md:w-2/3 p-4 text-text leading-relaxed border-border border-b group-last:border-b-0">
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

  // Fallback to variant-only specifications if no specs
  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      <h3 className="text-lg font-bold text-text">Thông tin chung</h3>
      <div className="border border-border rounded-lg overflow-hidden bg-canvas">
        {selectedVariant ? (
          <>
            <div className="flex flex-col md:flex-row text-sm">
              <div className="w-full md:w-1/3 bg-primary-soft p-4 text-text-muted font-medium border-border border-b md:border-b-white md:border-r">
                SKU
              </div>
              <div className="w-full md:w-2/3 p-4 text-text font-medium uppercase border-border border-b">
                {selectedVariant.sku}
              </div>
            </div>

            <div className="flex flex-col md:flex-row text-sm">
              <div className="w-full md:w-1/3 bg-primary-soft p-4 text-text-muted font-medium border-border border-b md:border-b-white md:border-r">
                Phiên bản
              </div>
              <div className="w-full md:w-2/3 p-4 text-text font-medium border-border border-b">
                {selectedVariant.variantName}
              </div>
            </div>

            <div className="flex flex-col md:flex-row text-sm group">
              <div className="w-full md:w-1/3 bg-primary-soft p-4 text-text-muted font-medium border-border border-b md:border-b-white md:border-r group-last:border-b-0">
                Tình trạng
              </div>
              <div className={`w-full md:w-2/3 p-4 font-medium border-border border-b group-last:border-b-0 ${inStock ? 'text-success' : 'text-danger'}`}>
                {inStock ? 'Còn hàng' : 'Hết hàng'}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-surface/50">
            <p className="text-muted text-sm">Đang cập nhật thông số kỹ thuật.</p>
          </div>
        )}
      </div>
    </div>
  );
}
