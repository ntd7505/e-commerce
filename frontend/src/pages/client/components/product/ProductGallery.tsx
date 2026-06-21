import React, { useState } from 'react';
import type { ProductMediaResponse } from '../../../../features/client/home/clientProductApi';

interface ProductGalleryProps {
  media: ProductMediaResponse[];
  productName: string;
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const activeMedia = [...media]
    .filter(m => m.active !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const defaultImage = activeMedia.length > 0 
    ? (activeMedia.find(m => m.thumbnail)?.url || activeMedia[0].url) 
    : '';

  const [activeImage, setActiveImage] = useState<string>('');
  
  const currentImage = activeImage || defaultImage;

  return (
    <div className="lg:w-[450px] flex flex-col gap-4 shrink-0">
      <div className="w-full aspect-square rounded-xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
        {currentImage ? (
          <img 
            src={currentImage} 
            alt={productName} 
            className="w-full h-full object-contain p-8 mix-blend-multiply" 
          />
        ) : (
          <div className="text-gray-400">Chưa có ảnh</div>
        )}
      </div>
      
      {activeMedia.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {activeMedia.slice(0, 5).map((item, index) => {
            const isLast = index === 4;
            const remaining = activeMedia.length - 5;
            
            if (isLast && remaining > 0) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveImage(item.url)}
                  className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden bg-white hover:border-blue-600 transition-all group"
                >
                  <img 
                    src={item.url} 
                    alt={item.altText || productName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center text-xs font-medium text-white">
                    +{remaining}
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveImage(item.url)}
                className={`aspect-square rounded-lg overflow-hidden bg-white transition-all ${
                  currentImage === item.url 
                    ? 'border-2 border-blue-600' 
                    : 'border border-gray-100 hover:border-blue-600'
                }`}
              >
                <img 
                  src={item.url} 
                  alt={item.altText || productName} 
                  className="w-full h-full object-cover" 
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
