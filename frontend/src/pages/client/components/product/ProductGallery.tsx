import React, { useState } from 'react';
import type { ProductMediaResponse } from '../../../../features/client/home/clientProductApi';
import { ShieldCheck, RotateCcw, PenTool, Zap } from 'lucide-react';

interface ProductGalleryProps {
  media: ProductMediaResponse[];
  productName: string;
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  // Filter active, sort by sortOrder. Thumbnail is prioritized.
  const activeMedia = [...media]
    .filter(m => m.active !== false)
    .sort((a, b) => {
      if (a.thumbnail === b.thumbnail) return a.sortOrder - b.sortOrder;
      return a.thumbnail ? -1 : 1;
    });

  const defaultImage = activeMedia.length > 0 ? activeMedia[0].url : '';

  const [activeImage, setActiveImage] = useState<string>('');
  
  const currentImage = activeImage || defaultImage;

  return (
    <div className="lg:w-[400px] xl:w-[450px] flex flex-col gap-3 shrink-0">
      <div className="w-full aspect-square rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center p-4">
        {currentImage ? (
          <img 
            src={currentImage} 
            alt={productName} 
            className="w-full h-full object-contain mix-blend-multiply" 
          />
        ) : (
          <div className="text-muted text-sm font-medium">Chưa có ảnh</div>
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
                  className="relative aspect-square rounded-lg border border-border overflow-hidden bg-surface hover:border-primary transition-all group"
                >
                  <img 
                    src={item.url} 
                    alt={item.altText || productName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs font-medium text-white">
                    +{remaining}
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveImage(item.url)}
                className={`aspect-square rounded-lg overflow-hidden bg-surface transition-all ${
                  currentImage === item.url 
                    ? 'border-2 border-primary' 
                    : 'border border-border hover:border-primary'
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

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Chính hãng 100%</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Đổi trả 30 ngày</span>
        </div>
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-text font-medium">Giao nhanh 2h</span>
        </div>
      </div>
    </div>
  );
}
